import 'chrome-devtools-frontend/front_end/entrypoints/shell/shell.ts';
import { applyDevtoolsPreference } from './main/state.mts';
import { startLanguageVM } from './main/connection.mts';
import { loadProtocolMonitorView, modifyConsoleView, registerFilesView } from './main/load-views.mts';
import { fixChromeDevtoolsFrontend, fixDOM, fixWorker } from './main/hack.mts';
import { initFeatureSettings } from './main/features.mts';
import * as Common from 'chrome-devtools-frontend/front_end/core/common/common.ts';
import * as Main from 'chrome-devtools-frontend/front_end/entrypoints/main/main.ts';

fixDOM();

applyDevtoolsPreference();
registerFilesView();
// registerEngine262View();
fixChromeDevtoolsFrontend();
fixWorker();

Common.Runnable.registerEarlyInitializationRunnable(initFeatureSettings);
Common.Runnable.registerEarlyInitializationRunnable(loadProtocolMonitorView);
Common.Runnable.registerEarlyInitializationRunnable(modifyConsoleView);
Common.Runnable.registerEarlyInitializationRunnable(startLanguageVM);

new Main.MainImpl.MainImpl();
window.dispatchEvent(new Event('loaded'));
