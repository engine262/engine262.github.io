import { getState, updateState } from './state.mjs';

const features = document.querySelector('#features');
const output = document.querySelector('#output');

let worker;
function respawn(first = false) {
  if (worker) {
    worker.terminate();
  }
  worker = new Worker(new URL('./worker.js', import.meta.url));
  worker.addEventListener('message', ({ data }) => {
    console.log('@MAIN', data); // eslint-disable-line no-console

    if (first && data.type === 'initialize') {
      const { FEATURES } = data.value;
      FEATURES.forEach(({ name }) => {
        // <li>
        //   <label>
        //     <input type="checkbox">
        //     {name}
        //   </label>
        // </li>

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.addEventListener('change', () => {
          getState('features')
            .then((f) => {
              if (input.checked) {
                f.add(name);
              } else {
                f.delete(name);
              }
              updateState();
              respawn();
            });
        });
        getState('features')
          .then((requestedFeatures) => {
            input.checked = requestedFeatures.has(name);
          });

        const label = document.createElement('label');
        label.appendChild(input);
        label.appendChild(document.createTextNode(name));

        const li = document.createElement('li');
        li.appendChild(label);

        features.appendChild(li);
      });
    } else if (data.type === 'console') {
      if (data.value.method === 'clear') {
        output.value = '';
      } else {
        data.value.values.forEach((v) => {
          output.value += v;
          output.value += ' ';
        });
        output.value += '\n';
      }
    }
  });
}

export function evaluate(code) {
  getState()
    .then((state) => {
      state.set('code', code);
      worker.postMessage({ type: 'evaluate', value: { code, state } });
    });
}

respawn(true);
