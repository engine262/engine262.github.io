// @ts-check
import 'chrome-devtools-frontend/entrypoints/shell/shell.js';
import * as Common from 'chrome-devtools-frontend/core/common/common.js';
import { FEATURES } from '../../../lib/engine262.mjs';
import { state } from './state.mjs';
import { L } from './i18n.mjs';
import { WorkerBootstrapEvent } from './helpers.mjs';
import { Engine262ConnectionTransport } from './connection.mjs';

/** @type {Map<{ name: string; flag: string; url?: string; }, Common.Settings.Setting<boolean>>} */
export const featureSettings = new Map();

export function initFeatureSettings() {
  return {
    async run() {
      WorkerBootstrapEvent.addEventListener('bootstrap', syncFeatureToVM);
      for (const feature of [
        ...FEATURES,
        { flag: 'test262-harness', name: L.engine262.includeTest262Env },
        { flag: 'virtual-module-loader', name: L.engine262.includeVirtualModuleLoader }
      ]) {
        const featureSetting = Common.Settings.Settings.instance().createSetting(`engine262:${feature.flag}`, false);
        if (state.features) {
          featureSetting.set(state.features.includes(feature.flag));
        }
        featureSetting.addChangeListener(syncFeatureToVM);
        featureSettings.set(feature, featureSetting);
      }
    },
  }
}

export function syncFeatureToVM() {
  const features = [];
  for (const setting of featureSettings.values()) {
    if (setting.get()) features.push(setting.name.split(':')[1]);
  }
  state.features = features;
  Engine262ConnectionTransport.instance?.sendRawMessage?.(JSON.stringify({
    id: '',
    method: 'Debugger.engine262_setFeatures',
    params: { features },
  }));
}
