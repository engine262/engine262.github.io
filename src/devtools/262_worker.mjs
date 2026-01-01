import {
  setSurroundingAgent,
  Agent,
  ManagedRealm,
  createTest262Intrinsics,
  evalQ,
  boostTest262Harness,
  Get,
  CreateDataPropertyOrThrow,
  Value,
  Realm,
  Throw,
  CreateBuiltinFunction,
  JSStringValue,
  CreateNonEnumerableDataPropertyOrThrow,
  surroundingAgent,
} from '../../lib/engine262.mjs';
import { Inspector, createConsole } from '../../lib/inspector.mjs';
import { Test262HarnessFiles } from '../shared/harness.mjs';

let abortController = new AbortController();
class WorkerInspector extends Inspector {
  send(/** @type {any} */ data) {
    postMessage(data);
  }
  constructor() {
    super();
    addEventListener('message', (e) => {
      const { id, method, params } = JSON.parse(e.data);
      if (method === 'Debugger.engine262_setFeatures') {
        abortController.abort();
        abortController = new AbortController();
        recreateAgent(params.features, abortController.signal);
        this.send({ id, result: {} });
        return;
      }
      this.onMessage(id, method, params);
    });
  }
}

const inspector = new WorkerInspector();
console.log('engine262 worker started');
postMessage('hello');

/**
 * @param {string[]} features
 * @param {AbortSignal} signal
 */
function recreateAgent(features, signal) {
  const agent = new Agent({ features });
  setSurroundingAgent(agent);


  inspector.attachAgent(agent, []);
  signal.addEventListener('abort', () => inspector.detachAgent(agent), { once: true });

  const realm = new ManagedRealm({ name: 'playground repl' });
  createConsole(realm, {});

  if (features.includes('virtual-module-loader')) {
    const virtualModuleCache = new Map();
    agent.hostDefinedOptions.loadImportedModule = (referrer, specifier, attributes, hostDefined, finish) => {
      const importerRealm = referrer instanceof Realm ? referrer : referrer.Realm;
      if (importerRealm instanceof ManagedRealm && virtualModuleCache.has(specifier)) {
        finish(importerRealm.compileModule(virtualModuleCache.get(specifier), { specifier }));
        return;
      }
      finish(Throw('SyntaxError', 'CouldNotResolveModule', specifier, 'repl'));
    }
    realm.scope(() => {
      const defineModule = CreateBuiltinFunction.from(function* defineModule(specifier, source) {
        if (!(specifier instanceof JSStringValue)) {
          return Throw('TypeError', 'NotAString', specifier);
        }
        if (!(source instanceof JSStringValue)) {
          return Throw('TypeError', 'NotAString', source);
        }
        if (surroundingAgent.debugger_cannotPreview) {
          return surroundingAgent.debugger_cannotPreview;
        }
        virtualModuleCache.set(specifier.stringValue(), source.stringValue());
        return Value.undefined;
      })
      CreateNonEnumerableDataPropertyOrThrow(realm.GlobalObject, Value('defineModule'), defineModule);
    });
  }

  if (features.includes('test262-harness')) {
    createTest262Intrinsics(realm, false);
    evalQ((_Q, X) => {
      for (const [specifier, file] of Object.entries(Test262HarnessFiles)) {
        const script = X(
          realm.compileScript(file, { specifier }),
        );
        realm.evaluateScript(script);
      }
      realm.scope(() => {
        const consoleTrace = X(Get(X(Get(realm.GlobalObject, Value('console'))), Value('trace')));
        X(CreateDataPropertyOrThrow(realm.GlobalObject, Value('$DONE'), consoleTrace));
      });
    });
    boostTest262Harness(realm);
  }
}
