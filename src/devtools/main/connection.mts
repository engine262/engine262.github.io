import 'chrome-devtools-frontend/front_end/entrypoints/shell/shell.ts';
import { ConnectionTransport } from 'chrome-devtools-frontend/front_end/core/protocol_client/protocol_client.ts';
import { ReloadEvent, WorkerBootstrapEvent } from './helpers.mts';
import * as SDK from 'chrome-devtools-frontend/front_end/core/sdk/sdk.ts';
import * as Components from 'chrome-devtools-frontend/front_end/ui/legacy/components/utils/utils.ts';
import { L, S } from './i18n.mts';

let instance: Engine262ConnectionTransport | undefined;
export class Engine262ConnectionTransport extends ConnectionTransport.ConnectionTransport {
  static get instance() {
    return instance;
  }

  #runner: Worker;
  #holdingMessages: undefined | any[] = []
  constructor() {
    super();
    instance = this;
    this.#holdingMessages = [];
    this.#runner = new Worker(new URL('/src/devtools/262_worker.mjs', import.meta.url), { type: 'module' });
    this.#runner.onerror = console.error;
    this.#runner.onmessage = this.#onHello;
    WorkerBootstrapEvent.dispatchEvent(new Event('bootstrap'));
    // the vm will be created & reported by a engine262_setFeatures call, which is triggered by the bootstrap event.
  }
  #onHello = () => {
    this.#runner.onmessage = (e) => {
      this.onMessage?.(e.data);
    };
    this.#holdingMessages?.forEach((message) => this.#runner.postMessage(message));
    this.#holdingMessages = undefined;
  }
  setOnMessage(_onMessage: ConnectionTransport.ConnectionTransport['onMessage']) {
    this.onMessage = _onMessage;
  }
  private onDisconnect?: (arg0: string) => void;
  setOnDisconnect(_onDisconnect: (arg0: string) => void) {
    this.onDisconnect = _onDisconnect;
  }
  sendRawMessage(message: string) {
    if (this.#holdingMessages) {
      this.#holdingMessages.push(message);
      return;
    }
    this.#runner.postMessage(message);
  }
  async disconnect() {
    this.#runner.terminate();
    this.onDisconnect?.('ConnectionTransport.disconnect()');
  }
}

export function startLanguageVM() {
  return {
    async run() {
      SDK.Connections.initMainConnection(async () => {
        ConnectionTransport.ConnectionTransport.setFactory(() => new Engine262ConnectionTransport());
        const targetManager = SDK.TargetManager.TargetManager.instance();

        let target: SDK.Target.Target;
        function init() {
          target = targetManager.createTarget('main', S.app(L.app.main), SDK.Target.Type.NODE, null);
          target.runtimeAgent().invoke_runIfWaitingForDebugger();
        }

        init();
        ReloadEvent.addEventListener('reload', () => {
          target.dispose('reload');
          init();
        });
      }, Components.TargetDetachedDialog.TargetDetachedDialog.connectionLost);
    },
  }
}
