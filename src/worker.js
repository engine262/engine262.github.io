'use strict';

/* eslint-env worker */

importScripts('https://unpkg.com/acorn@7.0.0/dist/acorn.js');
importScripts('https://unpkg.com/nearley@2.16.0/lib/nearley.js');
importScripts('https://engine262.js.org/engine262.js');

const {
  initializeAgent,
  Realm,
  Abstract,
  AbruptCompletion,
  Value,
  Throw,
  inspect,
  Object: APIObject,
  FEATURES,
} = self.engine262;

postMessage({ type: 'initialize', value: { FEATURES } });

addEventListener('message', ({ data }) => {
  console.log('@WORKER', data); // eslint-disable-line no-console

  if (data.type === 'evaluate') {
    const { state, code } = data.value;

    try {
      initializeAgent({
        features: [...state.get('features')],
      });
    } catch (e) {
      // o.o
    }

    const realm = new Realm();
    const print = new Value(realm, (args) => {
      postMessage({
        type: 'console',
        value: {
          method: 'log',
          values: args.map((a) => inspect(a)),
        },
      });
      return Value.undefined;
    }, [], realm);
    Abstract.CreateDataProperty(realm.global, new Value(realm, 'print'), print);

    const console = new APIObject(realm);
    Abstract.CreateDataProperty(realm.global, new Value(realm, 'console'), console);

    [
      'log',
      'warn',
      'debug',
      'error',
      'clear',
    ].forEach((method) => {
      const fn = new Value(realm, (args) => {
        postMessage({
          type: 'console',
          value: {
            method,
            values: args.map((a) => inspect(a)),
          },
        });
        return Value.undefined;
      });
      Abstract.CreateDataProperty(console, new Value(realm, method), fn);
    });

    postMessage({
      type: 'console',
      value: {
        method: 'clear',
        values: [],
      },
    });

    let result;
    if (state.get('mode') === 'script') {
      result = realm.evaluateScript(code);
    } else {
      result = realm.createSourceTextModule('engine262.mjs', code);
      if (!(result instanceof AbruptCompletion)) {
        const module = result;
        realm.moduleEntry = module;
        result = module.Link();
        if (!(result instanceof AbruptCompletion)) {
          result = module.Evaluate();
          if (result.PromiseState === 'rejected') {
            result = Throw(realm, result.PromiseResult);
          }
        }
      }
    }
    if (result instanceof AbruptCompletion) {
      let inspected;
      if (Abstract.Type(result.Value) === 'Object') {
        const errorToString = realm.realm.Intrinsics['%Error.prototype%'].properties.get(new Value(realm, 'toString')).Value;
        inspected = Abstract.Call(errorToString, result.Value).stringValue();
      } else {
        inspected = inspect(result, realm);
      }
      postMessage({
        type: 'console',
        value: {
          method: 'error',
          values: [inspected],
        },
      });
    }
  }
});
