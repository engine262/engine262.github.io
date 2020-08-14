import './state.mjs';
import './editor.mjs';

try {
  document.querySelector('#loading').close();
} catch (e) {
  // not all browsers support this
}
