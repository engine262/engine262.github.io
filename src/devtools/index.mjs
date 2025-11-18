// @ts-nocheck
import 'chrome-devtools-frontend/entrypoints/shell/shell.js';
import * as Common from 'chrome-devtools-frontend/core/common/common.js';
import * as i18n from 'chrome-devtools-frontend/core/i18n/i18n.js';
import * as SDK from 'chrome-devtools-frontend/core/sdk/sdk.js';
import * as Components from 'chrome-devtools-frontend/ui/legacy/components/utils/utils.js';
import * as UI from 'chrome-devtools-frontend/ui/legacy/legacy.js';
import { SettingsUI } from 'chrome-devtools-frontend/ui/legacy/components/settings_ui/settings_ui.js';
import * as Main from 'chrome-devtools-frontend/entrypoints/main/main.js';
import * as Root from 'chrome-devtools-frontend/core/root/root.js';
import { InspectorFrontendHostInstance } from 'chrome-devtools-frontend/core/host/InspectorFrontendHost.js';
import { InspectorBackend, ConnectionTransport } from 'chrome-devtools-frontend/core/protocol_client/protocol_client.js';
import lzString from 'https://cdn.jsdelivr.net/npm/lz-string@1.5.0/+esm';
import { FEATURES } from '../../lib/engine262.mjs';

// Fix crash on Firefox (non standard / unsupported api used)
ShadowRoot.prototype.getSelection = ShadowRoot.prototype.getComponentSelection;
Element.prototype.scrollIntoViewIfNeeded = Element.prototype.scrollIntoView;

// @ts-ignore
/** @type {<T>(x: T) => NonNullable<T>} */ const X = (x) => x;

// #region preference
localStorage.setItem('disable-self-xss-warning', 'true');
if (localStorage.getItem('console-show-settings-toolbar') === null) {
  localStorage.setItem('console-show-settings-toolbar', 'true');
}
if (localStorage.getItem('experiments') === null) {
  localStorage.setItem('experiments', '{"protocol-monitor":true}');
}
// #endregion

// #region i18n
const L = {
  app: {
    main: 'Main',
    networkTitle: 'Scripts',
    showNode: 'Show Scripts',
  },
  settings: { settings: 'Settings' },
  engine262: {
    panelTitle: 'engine262',
    showPanel: 'Show engine262',
    title: ': A JavaScript engine written in JavaScript for development and exploration',
    featureSwitch: 'Enable {name}',
    includeTest262Env: 'Include test262 environment',
    evaluateAs: 'Evaluate as ',
    console: 'Console',
    script: 'Script',
    module: 'Module',
    reload: 'Reload the engine262 worker',
    share: 'Share as URL',
    copyToShare: 'Copy the following URL to share',
    selectFile: 'Select File',
  },
};
const LA = {
  app: i18n.i18n.registerUIStrings('entrypoints/js_app/js_app.ts', L.app),
  settings: i18n.i18n.registerUIStrings('panels/settings/SettingsScreen.ts', L.settings),
  engine262: i18n.i18n.registerUIStrings('engine262', L.engine262),
};

// eslint-disable-next-line max-len
/** @type {Record<'app' | 'settings' | 'engine262', (id: string, values?: Record<string, string | number | boolean>) => Common.UIString.LocalizedString>} */
const S = {
  app: i18n.i18n.getLocalizedString.bind(undefined, LA.app),
  settings: i18n.i18n.getLocalizedString.bind(undefined, LA.settings),
  engine262: i18n.i18n.getLocalizedString.bind(undefined, LA.engine262),
};
// eslint-disable-next-line max-len
/** @type {Record<'app' | 'settings' | 'engine262', (id: string, values?: Record<string, string | number | boolean>) => () => Common.UIString.LocalizedString>} */
const SL = {
  app: i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, LA.app),
  settings: i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, LA.settings),
  engine262: i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, LA.engine262),
};
// #endregion

const ReloadEvent = new EventTarget();
/** @type {() => void} */
let onWorkerBootstrap;
class Engine262ConnectionTransport extends ConnectionTransport.ConnectionTransport {
  /** @type {Worker} */ #runner;
  /** @type {undefined | any[]} */ #holdingMessages = []
  constructor() {
    super();
    this.#runner = this.#setup();
    ReloadEvent.addEventListener('reload', () => {
      this.#runner.terminate();
      this.#setup();
      this.onMessage?.({ method: 'Runtime.executionContextsCleared', params: null });
    });
  }
  #setup() {
    this.#holdingMessages = [];
    this.#runner = new Worker(new URL('./262_worker.mjs', import.meta.url), { type: 'module' });
    this.#runner.onerror = console.error;
    this.#runner.onmessage = this.#onMessage;
    onWorkerBootstrap?.();
    return this.#runner;
  }
  #onMessage = () => {
    this.#runner.onmessage = (e) => {
      this.onMessage?.(e.data);
    };
    this.#holdingMessages?.forEach((message) => this.#runner.postMessage(message));
    this.#holdingMessages = undefined;
  }
  setOnMessage(/** @type {Engine262ConnectionTransport['onMessage']} */ _onMessage) {
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

UI.ViewManager.registerViewExtension({
  // @ts-ignore
  location: 'navigator-view',
  id: 'navigator-network',
  title: SL.app(L.app.networkTitle),
  commandPrompt: SL.app(L.app.showNode),
  order: 2,
  // @ts-ignore
  persistence: 'permanent',
  async loadView() {
    const Sources = await import('chrome-devtools-frontend/panels/sources/sources.js');
    return Sources.SourcesNavigator.NetworkNavigatorView.instance();
  },
});

// Fix reload devtools button
InspectorFrontendHostInstance.reattach = (f) => f();
// Remove not implemented panels
UI.ViewManager.maybeRemoveViewExtension('heap-profiler');
// Define engine262 panel
UI.ViewManager.registerViewExtension({
  // @ts-ignore
  location: 'panel',
  id: 'engine262',
  title: SL.engine262(L.engine262.panelTitle),
  commandPrompt: SL.engine262(L.engine262.showPanel),
  order: Infinity,
  // @ts-ignore
  persistence: 'permanent',
  async loadView() {
    return class Engine262Document extends UI.Widget.Widget {
      /** @type {Engine262Document} */
      static instance
      static new(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!Engine262Document.instance || forceNew) {
          Engine262Document.instance = new Engine262Document();
        }
        return Engine262Document.instance;
      }
      constructor() {
        super();
        this.setHideOnDetach();
        this.element.className = 'vbox flex-auto';
        this.setDefaultFocusedElement(this.element);
        const template = document.getElementById('engine262-readme-template');
        if (!(template instanceof HTMLTemplateElement)) throw new Error('');
        const dom = template.content.cloneNode(true);
        if (!(dom instanceof DocumentFragment)) throw new Error('');

        X(dom.querySelector('.page-title span')).textContent = S.engine262(L.engine262.title);
        this.element.append(dom);
        const e = this.element;

        async function render() {
          // @ts-ignore
          const { marked } = await import('https://cdn.jsdelivr.net/npm/marked@15.0.7/+esm');
          const readme = await fetch(
            'https://raw.githubusercontent.com/engine262/engine262/refs/heads/main/README.md',
          );
          const text = await readme.text();
          if (!(dom instanceof DocumentFragment)) throw new Error('');
          X(e.querySelector('article')).innerHTML = marked(text);
        }
        render();
      }
    }.new();
  },
});

// Start the connection to the worker
Common.Runnable.registerEarlyInitializationRunnable(() => ({
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
}));

// Enable protocol monitor and preload modules
Common.Runnable.registerEarlyInitializationRunnable(() => ({
  async run() {
    Root.Runtime.experiments.setEnabled('protocol-monitor', true);
    import('./late-panels.mjs');
  },
}));

/**
 * Adjust UI for engine262
 * @param {import('chrome-devtools-frontend/panels/console/console.js').ConsolePanel} ConsolePanel
 */
function modifyUI(ConsolePanel) {
  const Console = ConsolePanel.ConsolePanel.instance();
  const settingsPane = Console.element.querySelector('.console-settings-pane');
  if (!settingsPane) return false;
  if (!settingsPane.children[8]) {
    return false;
  }
  settingsPane.children[8].remove(); // cors
  settingsPane.children[7].remove(); // user activation
  settingsPane.children[1].remove(); // xhr
  settingsPane.children[0].remove(); // network

  const search = new URLSearchParams(location.hash.slice(1));
  location.hash = '';
  const state = new Proxy(
    {
      mode: search.get('mode'),
      code: search.has('code')
        ? (lzString.decompressFromBase64(X(search.get('code'))) || 'console.log("Hello engine262!");')
        : 'console.log("Hello engine262!");',
      features: search.has('feature') ? search.getAll('feature') : undefined,
    },
    {
      set(target, key, value) {
        if (key === 'code') {
          search.set('code', lzString.compressToBase64(value));
        } else if (key === 'features') {
          search.delete('feature');
          for (const feature of value) search.append('feature', feature);
        } else if (key === 'mode') {
          search.set(key, value);
        }
        return Reflect.set(target, key, value);
      },
    },
  );

  const editor = X(Console.element.querySelector('devtools-text-editor'));
  editor.dispatch({
    changes: [{ from: 0, insert: X(state.code) }],
    selection: { anchor: state.code.length, head: 0 },
  });

  // features
  /** @type {Common.Settings.Setting<boolean>[]} */
  const featureSettings = [];
  for (const feature of FEATURES) {
    const featureSetting = Common.Settings.Settings.instance().createSetting(`engine262:${feature.flag}`, false);
    if (state.features) {
      featureSetting.set(state.features.includes(feature.flag));
    }
    featureSetting.addChangeListener(updateFeature);
    featureSettings.push(featureSetting);
    settingsPane.append(
      SettingsUI.createSettingCheckbox(
        S.engine262(L.engine262.featureSwitch, feature),
        featureSetting,
        feature.url,
      ),
    );
  }
  {
    const test262HarnessSetting = Common.Settings.Settings.instance().createSetting(
      'engine262:test262-harness',
      true,
    );
    if (state.features) {
      test262HarnessSetting.set(state.features.includes('test262-harness'));
    }
    test262HarnessSetting.addChangeListener(updateFeature);
    featureSettings.push(test262HarnessSetting);
    settingsPane.append(
      SettingsUI.createSettingCheckbox(
        S.engine262(L.engine262.includeTest262Env),
        test262HarnessSetting,
      ),
    );
  }
  function updateFeature() {
    const features = [];
    for (const setting of featureSettings) {
      if (setting.get()) features.push(setting.name.split(':')[1]);
    }
    state.features = features;
    InspectorBackend.test.sendRawMessage?.(
      // @ts-expect-error
      'Debugger.engine262_setFeatures',
      { features },
      () => {},
    );
  }

  // eval mode
  let updateEvalMode = () => {};
  {
    const settingsEvaluateMode = 'engine262-evaluate-mode';
    const stored = state.mode || localStorage.getItem(settingsEvaluateMode);
    const typeSelectorLabel = document.createElement('label');
    typeSelectorLabel.textContent = S.engine262(L.engine262.evaluateAs);
    const evaluate = typeSelectorLabel.appendChild(document.createElement('select'));
    evaluate.addEventListener('change', () => {
      state.mode = evaluate.value;
      InspectorBackend.test.sendRawMessage?.(
        // @ts-expect-error
        'Debugger.engine262_setEvaluateMode',
        { mode: evaluate.value },
        () => {},
      );
      localStorage.setItem(settingsEvaluateMode, evaluate.value);
    });
    evaluate.appendChild(new Option(S.engine262(L.engine262.script), 'script', false, stored === 'script'));
    evaluate.appendChild(new Option(S.engine262(L.engine262.module), 'module', false, stored === 'module'));
    evaluate.appendChild(new Option(S.engine262(L.engine262.console), 'console', false, stored === 'console'));

    const toolbar = Console.element.querySelector('devtools-toolbar');
    toolbar?.children[4].after(typeSelectorLabel, new UI.Toolbar.ToolbarSeparator().element);
    updateEvalMode = () => {
      evaluate.dispatchEvent(new Event('change'));
    };
  }

  onWorkerBootstrap = () => {
    updateEvalMode();
    updateFeature();
  };
  onWorkerBootstrap();

  // reload, select file & share button
  {
    const toolbar = Console.element.querySelector('devtools-toolbar');
    const dom = document.createElement('div');
    dom.innerHTML = `
      <devtools-button class="toolbar-button"></devtools-button>
      <devtools-button class="toolbar-button"></devtools-button>
      <devtools-button class="toolbar-button"></devtools-button>
    `;
    // Note: this custom element is bad: Failed to execute 'createElement' on 'Document':
    // The result must not have attributes
    // const button = document.createElement('devtools-button')
    const [reloadButton, selectFileButton, shareButton] = dom.querySelectorAll('devtools-button');

    reloadButton.addEventListener('click', () => ReloadEvent.dispatchEvent(new Event('reload')));
    reloadButton.iconName = 'refresh';
    // @ts-expect-error
    reloadButton.variant = 'toolbar';
    reloadButton.title = S.engine262(L.engine262.reload);
    reloadButton.ariaLabel = S.engine262(L.engine262.reload);

    selectFileButton.addEventListener('click', async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        if (!file) {
          return;
        }
        const content = await file.text();
        editor.dispatch({
          changes: [{ from: 0, to: editor.state.doc.length, insert: content }],
          selection: { anchor: content.length, head: 0 },
        });
      };
    });
    selectFileButton.iconName = 'plus';
    // @ts-expect-error
    selectFileButton.variant = 'toolbar';
    selectFileButton.title = S.engine262(L.engine262.selectFile);
    selectFileButton.ariaLabel = S.engine262(L.engine262.selectFile);

    shareButton.addEventListener('click', () => {
      state.code = editor.state.doc.toString();
      const url = new URL(location.href);
      url.hash = `#${search.toString()}`;
      // eslint-disable-next-line no-alert
      prompt(S.engine262(L.engine262.copyToShare), url.toString());
    });
    shareButton.iconName = 'open-externally';
    // @ts-expect-error
    shareButton.variant = 'toolbar';
    shareButton.title = S.engine262(L.engine262.share);
    shareButton.ariaLabel = S.engine262(L.engine262.share);
    toolbar?.children[0].after(dom);
  }
  return true;
}

// Modify console UI
Common.Runnable.registerEarlyInitializationRunnable(() => ({
  async run() {
    const { ConsolePanel } = await import('chrome-devtools-frontend/panels/console/console.js');
    const Console = ConsolePanel.ConsolePanel.instance();

    if (modifyUI(ConsolePanel)) return;

    const old = Console.show;
    Object.defineProperty(Console, 'show', {
      configurable: true,
      value(/** @type {any[]} */ ...args) {
        Reflect.apply(old, this, args);
        if (modifyUI(ConsolePanel)) {
          Reflect.deleteProperty(Console, 'show');
        }
      },
    });
  },
}));

// start the application
// eslint-disable-next-line no-new
new Main.MainImpl.MainImpl();
// hide the loading screen
window.dispatchEvent(new Event('loaded'));
