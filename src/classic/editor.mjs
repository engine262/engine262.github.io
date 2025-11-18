/* global CodeMirror */

import { getState, setState } from './state.mjs';
import { evaluate } from './runner.mjs';

/** @type {HTMLInputElement | null} */
const autoEvaluate = document.querySelector('#autoevaluate');
const selectFileButton = document.querySelector('#select-file');
selectFileButton?.addEventListener('click', async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.click();
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const content = await file.text();
    editor.setValue(content);
  }
});
/** @type {HTMLButtonElement | null} */
const runButton = document.querySelector('#run');
/** @type {HTMLSelectElement | null} */
const mode = document.querySelector('#mode');

const editor = CodeMirror.fromTextArea(document.querySelector('#input'), {
  lineNumbers: true,
  mode: 'javascript',
});

/** @type {ReturnType<typeof setTimeout> | null} */
let onChangeTimer;
function run(/** @type {boolean} */timer) {
  if (timer) {
    if (onChangeTimer !== null) {
      clearTimeout(onChangeTimer);
    }
    onChangeTimer = setTimeout(() => {
      onChangeTimer = null;
      evaluate(editor.getValue());
    }, 500);
  } else {
    evaluate(editor.getValue());
  }
}

editor.on('change', () => {
  if (!autoEvaluate?.checked) {
    return;
  }
  run(true);
});

runButton?.addEventListener('click', () => {
  run(false);
});

getState('code')
  .then((/** @type {any} */ code) => {
    editor.setValue(code);
  });

mode?.addEventListener('change', () => {
  setState('mode', mode.value);
  run(false);
});

getState('mode')
  .then((/** @type {any} */ m) => {
    if (mode) {
      mode.value = m;
    }
  });
