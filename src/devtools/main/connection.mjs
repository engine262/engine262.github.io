// @ts-check
import 'chrome-devtools-frontend/entrypoints/shell/shell.js';
// @ts-expect-error
import { ConnectionTransport } from 'chrome-devtools-frontend/core/protocol_client/protocol_client.js';
import { ReloadEvent, WorkerBootstrapEvent } from './helpers.mjs';
import * as SDK from 'chrome-devtools-frontend/core/sdk/sdk.js';
import * as Components from 'chrome-devtools-frontend/ui/legacy/components/utils/utils.js';
import { L, S } from './i18n.mjs';

/** @type {Engine262ConnectionTransport | undefined} */
let instance;
export class Engine262ConnectionTransport extends ConnectionTransport.ConnectionTransport {
  static get instance() {
    return instance;
  }

  /** @type {Worker} */ #runner;
  /** @type {undefined | any[]} */ #holdingMessages = []
  constructor() {
    super();
    instance = this;
    this.#runner = this.#setup();
    ReloadEvent.addEventListener('reload', () => {
      this.#runner.terminate();
      this.#setup();
      this.onMessage?.({ method: 'Runtime.executionContextsCleared', params: null });
    });
  }
  #setup() {
    this.#holdingMessages = [];
    this.#runner = new Worker(new URL('../262_worker.mjs', import.meta.url), { type: 'module' });
    this.#runner.onerror = console.error;
    this.#runner.onmessage = this.#onHello;
    WorkerBootstrapEvent.dispatchEvent(new Event('bootstrap'));
    // the vm will be created & reported by a engine262_setFeatures call, which is triggered by the bootstrap event.
    return this.#runner;
  }
  #onHello = () => {
    this.#runner.onmessage = (e) => {
      this.onMessage?.(e.data);
    };
    this.#holdingMessages?.forEach((message) => this.#runner.postMessage(message));
    this.#holdingMessages = undefined;
  }
  setOnMessage(/** @type {ConnectionTransport.ConnectionTransport['onMessage']} */ _onMessage) {
    this.onMessage = _onMessage;
  }
  setOnDisconnect(/** @type {(arg0: string) => void} */ _onDisconnect) {
    this.onDisconnect = _onDisconnect;
  }
  sendRawMessage(/** @type {string} */ message) {
    if (this.#holdingMessages) {
      this.#holdingMessages.push(message);
      return;
    }
    this.#runner.postMessage(message);
  }
  async disconnect() {
    // TODO
  }
}

export function startLanguageVM() {
  return {
    async run() {
      SDK.Connections.initMainConnection(async () => {
        ConnectionTransport.ConnectionTransport.setFactory(() => new Engine262ConnectionTransport());
        const target = SDK.TargetManager.TargetManager.instance().createTarget(
          'main',
          S.app(L.app.main),
          SDK.Target.Type.NODE,
          null,
        );
        target.runtimeAgent().invoke_runIfWaitingForDebugger();
      }, Components.TargetDetachedDialog.TargetDetachedDialog.connectionLost);
    },
  }
}
