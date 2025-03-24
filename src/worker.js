'use strict';

/* eslint-env worker */
/* eslint-disable no-restricted-globals */

importScripts('/engine262/engine262.js');

const {
  Agent,
  Value,
  JSStringValue,
  ManagedRealm,

  CreateDataProperty,
  OrdinaryObjectCreate,
  CreateBuiltinFunction,

  evalQ,
  skipDebugger,
  ThrowCompletion,
  AbruptCompletion,

  setSurroundingAgent,
  inspect,
  FEATURES,
} = /** @type {import('../../engine262/declaration/index.d.mts')} */ (self['@engine262/engine262'])

postMessage({ type: 'initialize', value: { FEATURES } });

addEventListener('message', ({ data }) => {
  console.log('@WORKER', data); // eslint-disable-line no-console

  if (data.type === 'evaluate') {
    const { state, code } = data.value;

    const agent = new Agent({
      features: [...state.get('features')],
      onDebugger() {
        debugger; // eslint-disable-line no-debugger
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
      skipDebugger(CreateDataProperty(realm.GlobalObject, Value('print'), print))

      {
        const console = OrdinaryObjectCreate(agent.intrinsic('%Object.prototype%'));
        skipDebugger(CreateDataProperty(realm.GlobalObject, Value('console'), console));

        [
          'log',
          'warn',
          'debug',
          'error',
          'clear',
        ].forEach((method) => {
          const fn = CreateBuiltinFunction((args) => {
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
            return Value.undefined;
          }, 1, Value(''), []);
          CreateDataProperty(console, Value(method), fn);
        });
      }

      postMessage({
        type: 'console',
        value: {
          method: 'clear',
          values: [],
        },
      });

      let result;
      if (state.get('mode') === 'script') {
        result = realm.evaluateScript(code, { specifier: 'code.js' });
      } else {
        result = evalQ((Q) => {
            const module = Q(realm.createSourceTextModule('code.mjs', code))
            Q(module.LoadRequestedModules())
            Q(module.Link())
            const promise = Q(skipDebugger(module.Evaluate()))
            if (promise.PromiseState === 'rejected') {
                return ThrowCompletion(promise.PromiseResult || Value.undefined)
            }
        })
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
