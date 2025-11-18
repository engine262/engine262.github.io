import { createConsole } from '../../lib/inspector.mjs';
import { Test262HarnessFiles } from '../shared/harness.mjs';
import {
  Agent,
  Value,
  JSStringValue,
  ManagedRealm,
  CreateDataProperty,
  CreateBuiltinFunction,
  skipDebugger,
  AbruptCompletion,
  setSurroundingAgent,
  inspect,
  FEATURES,
  createTest262Intrinsics,
} from '../../lib/engine262.mjs';

postMessage({
  type: 'initialize',
  value: {
    FEATURES: [{
      name: 'Test262 harness',
      flag: 'test262-harness',
      url: '#',
    }].concat(FEATURES),
  },
});

addEventListener('message', ({ data }) => {
  console.log('@WORKER', data); // eslint-disable-line no-console

  if (data.type === 'evaluate') {
    const { state, code } = data.value;

    const agent = new Agent({
      features: [...state.get('features')],
      onDebugger() {
        // Note: If you're reading this, you should try our new inspector that supports real debugger
        // https://engine262.js.org/next.html
        debugger;
      },
    });
    setSurroundingAgent(agent);

    const promises = new Set();
    const realm = new ManagedRealm({
      promiseRejectionTracker(promise, operation) {
        switch (operation) {
          case 'reject':
            promises.add(promise);
            break;
          case 'handle':
            promises.delete(promise);
            break;
          default:
            break;
        }
      },
    });

    realm.scope(() => {
      const print = CreateBuiltinFunction((args) => {
        postMessage({
          type: 'console',
          value: {
            method: 'log',
            values: args.map((a) => inspect(a)),
          },
        });
        return Value.undefined;
      }, 1, Value('print'), []);
      skipDebugger(CreateDataProperty(realm.GlobalObject, Value('print'), print));

      createConsole(realm, {
        * default(method, args) {
          postMessage({
            type: 'console',
            value: {
              method,
              values: args.map((a, i) => {
                if (i === 0 && a instanceof JSStringValue) {
                  return a.stringValue();
                }
                return inspect(a);
              }),
            },
          });
        }
      })

      postMessage({
        type: 'console',
        value: {
          method: 'clear',
          values: [],
        },
      });

      if (state.get('features').has('test262-harness')) {
        createTest262Intrinsics(realm, false);
        Object.entries(Test262HarnessFiles).forEach(([url, content]) => {
          realm.evaluateScript(content, { specifier: url });
        });
      }

      let result;
      if (state.get('mode') === 'script') {
        result = realm.evaluateScript(code, { specifier: 'code.js' });
      } else {
        result = realm.evaluateModule(code, 'code.mjs');
      }
      if (result instanceof AbruptCompletion) {
        postMessage({
          type: 'console',
          value: {
            method: 'error',
            values: [inspect(result)],
          },
        });
      }

      for (const promise of promises) {
        postMessage({
          type: 'unhandledRejection',
          // eslint-disable-next-line no-use-before-define
          value: inspect(promise.PromiseResult),
        });
      }
    });
  }
});
