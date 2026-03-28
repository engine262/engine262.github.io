// @ts-check
import 'chrome-devtools-frontend/front_end/entrypoints/shell/shell.ts';
import * as Common from 'chrome-devtools-frontend/front_end/core/common/common.ts';
import { FEATURES } from '../../../lib/engine262.mjs';
import { state } from './state.mts';
import { L } from './i18n.mts';
import { WorkerBootstrapEvent } from './helpers.mts';
import { Engine262ConnectionTransport } from './connection.mts';

export const featureSettings = new Map<{ name: string; flag: string; url?: string; }, Common.Settings.Setting<boolean>>();

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
