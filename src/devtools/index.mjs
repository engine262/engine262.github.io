// @ts-check
import 'chrome-devtools-frontend/entrypoints/shell/shell.js';
import { applyDevtoolsPreference } from './main/state.mjs';
import { startLanguageVM } from './main/connection.mjs';
import { loadProtocolMonitorView, modifyConsoleView, registerFilesView } from './main/load-views.mjs';
import { fixChromeDevtoolsFrontend, fixDOM } from './main/hack.mjs';
import { initFeatureSettings } from './main/features.mjs';
import * as Common from 'chrome-devtools-frontend/core/common/common.js';
import * as Main from 'chrome-devtools-frontend/entrypoints/main/main.js';

fixDOM();

applyDevtoolsPreference();
registerFilesView();
// registerEngine262View();
fixChromeDevtoolsFrontend();

Common.Runnable.registerEarlyInitializationRunnable(initFeatureSettings);
Common.Runnable.registerEarlyInitializationRunnable(loadProtocolMonitorView);
Common.Runnable.registerEarlyInitializationRunnable(modifyConsoleView);
Common.Runnable.registerEarlyInitializationRunnable(startLanguageVM);

new Main.MainImpl.MainImpl();
window.dispatchEvent(new Event('loaded'));
