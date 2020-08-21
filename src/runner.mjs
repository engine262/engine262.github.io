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
      FEATURES.forEach(({ name, flag }) => {
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
                f.add(flag);
              } else {
                f.delete(flag);
              }
              updateState();
              respawn();
            });
        });
        getState('features')
          .then((requestedFeatures) => {
            input.checked = requestedFeatures.has(flag);
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
        const range = document.createRange();
        range.selectNodeContents(output);
        range.deleteContents();
      } else {
        const line = document.createElement('span');
        data.value.values.forEach((v) => {
          line.textContent += v;
          line.textContent += ' ';
        });
        const container = document.createElement('div');
        container.className = `log-${data.value.method}`;
        container.appendChild(line);
        output.appendChild(container);
      }
    } else if (data.type === 'unhandledRejection') {
      const line = document.createElement('span');
      line.textContent = `Unhandled Rejection:\n${data.value}`;
      const container = document.createElement('div');
      container.className = 'log-error';
      container.appendChild(line);
      output.appendChild(container);
    }
  });
}

export function evaluate(code) {
  getState()
    .then((state) => {
      state.set('code', code);
      worker.postMessage({ type: 'evaluate', value: { code, state } });
      return updateState();
    });
}

respawn(true);
