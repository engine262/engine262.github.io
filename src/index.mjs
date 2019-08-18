import './state.mjs';
import './editor.mjs';

const loading = document.querySelector('#loading');

try {
  loading.close();
} catch (e) {
  // not all browsers support this
}
