/* global CodeMirror */

import { getState, setState } from './state.mjs';
import { evaluate } from './runner.mjs';

const autoEvaluate = document.querySelector('#autoevaluate');
const runButton = document.querySelector('#run');
const mode = document.querySelector('#mode');

const editor = CodeMirror.fromTextArea(document.querySelector('#input'), {
  lineNumbers: true,
  mode: 'javascript',
});

let onChangeTimer;
function run(timer) {
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
  if (!autoEvaluate.checked) {
    return;
  }
  run(true);
});

runButton.addEventListener('click', () => {
  run(false);
});

getState('code')
  .then((code) => {
    editor.setValue(code);
  });

mode.addEventListener('change', () => {
  setState('mode', mode.value);
  run(false);
});

getState('mode')
  .then((m) => {
    mode.value = m;
  });
