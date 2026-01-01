import * as Common from 'chrome-devtools-frontend/core/common/common.js';
import * as i18n from 'chrome-devtools-frontend/core/i18n/i18n.js';

export const L = {
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
    featureSwitch: 'Feature: {name}',
    includeTest262Env: 'Include test262 harness',
    includeVirtualModuleLoader: 'Include playground module loader (defineModule)',
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

/** @type {Record<'app' | 'settings' | 'engine262', (id: string, values?: Record<string, string | number | boolean>) => Common.UIString.LocalizedString>} */
export const S = {
  app: i18n.i18n.getLocalizedString.bind(undefined, LA.app),
  settings: i18n.i18n.getLocalizedString.bind(undefined, LA.settings),
  engine262: i18n.i18n.getLocalizedString.bind(undefined, LA.engine262),
};

// eslint-disable-next-line max-len
/** @type {Record<'app' | 'settings' | 'engine262', (id: string, values?: Record<string, string | number | boolean>) => () => Common.UIString.LocalizedString>} */
export const SL = {
  app: i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, LA.app),
  settings: i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, LA.settings),
  engine262: i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, LA.engine262),
};
