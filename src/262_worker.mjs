import {
  setSurroundingAgent,
  Agent,
  ManagedRealm,
  createTest262Intrinsics,
  evalQ,
} from '../lib/engine262.mjs';
import { Inspector, createConsole } from '../lib/inspector.mjs';
import { Test262HarnessFiles } from './harness.mjs';

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

  const realm = new ManagedRealm({});
  createConsole(realm, {});

  if (features.includes('test262-harness')) {
    createTest262Intrinsics(realm, false);
    evalQ((Q, X) => {
      for (const [specifier, file] of Object.entries(Test262HarnessFiles)) {
        const script = X(
          realm.compileScript(file, { specifier }),
        );
        realm.evaluateScript(script);
      }
    });
  }
}
