// @ts-check
import 'chrome-devtools-frontend/entrypoints/shell/shell.js';
import * as UI from 'chrome-devtools-frontend/ui/legacy/legacy.js';
// @ts-expect-error
import { SettingsUI } from 'chrome-devtools-frontend/ui/legacy/components/settings_ui/settings_ui.js';
import { L, S, SL } from './i18n.mjs';
import { fixCSSHostContext } from './hack.mjs';
import { ReloadEvent, WorkerBootstrapEvent, X } from './helpers.mjs';
import * as Root from 'chrome-devtools-frontend/core/root/root.js';
import { search, state } from './state.mjs';
import { featureSettings } from './features.mjs';
import { Engine262ConnectionTransport } from './connection.mjs';

export function registerFilesView() {
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
      fixCSSHostContext(Sources);
      return Sources.SourcesNavigator.NetworkNavigatorView.instance();
    },
  });
}

export function registerEngine262View() {
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
}

export function loadProtocolMonitorView() {
  return {
    async run() {
      Root.Runtime.experiments.setEnabled('protocol-monitor', true);
      import('../late-panels.mjs');
    },
  }
}

export function modifyConsoleView() {
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

    const editor = X(Console.element.querySelector('devtools-text-editor'));
    editor.dispatch({
      changes: [{ from: 0, insert: X(state.code) }],
    });

    // features
    for (const [feature, featureSetting] of featureSettings) {
      settingsPane.append(
        SettingsUI.createSettingCheckbox(
          S.engine262(L.engine262.featureSwitch, feature),
          featureSetting,
          feature.url || '',
        ),
      );
    }

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
          const file = X(input.files)[0];
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
    addEvaluateModeOption();
    return true;
  }

  function addEvaluateModeOption() {
    // eval mode
    const settingsEvaluateMode = 'engine262-evaluate-mode';
    const stored = state.mode || localStorage.getItem(settingsEvaluateMode);
    const typeSelectorLabel = document.createElement('label');
    typeSelectorLabel.textContent = S.engine262(L.engine262.evaluateAs);
    const evaluate = typeSelectorLabel.appendChild(document.createElement('select'));
    evaluate.addEventListener('change', () => {
      state.mode = evaluate.value;
      Engine262ConnectionTransport.instance?.sendRawMessage?.(JSON.stringify({
        id: '',
        method: 'Debugger.engine262_setEvaluateMode',
        params: { mode: evaluate.value },
      }));
      localStorage.setItem(settingsEvaluateMode, evaluate.value);
    });
    evaluate.appendChild(new Option(S.engine262(L.engine262.script), 'script', false, stored === 'script'));
    evaluate.appendChild(new Option(S.engine262(L.engine262.module), 'module', false, stored === 'module'));
    evaluate.appendChild(new Option(S.engine262(L.engine262.console), 'console', false, stored === 'console'));

    // @ts-expect-error
    const toolbar = Console.element?.querySelector('devtools-toolbar');
    toolbar?.children[4].after(typeSelectorLabel, new UI.Toolbar.ToolbarSeparator().element);

    WorkerBootstrapEvent.addEventListener('bootstrap', () => {
      evaluate.dispatchEvent(new Event('change'));
    });
    evaluate.dispatchEvent(new Event('change'));
  }

  return {
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
  }
}
