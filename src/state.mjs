/* global LZString */

const query = new URLSearchParams(document.location.hash.slice(1));

const EXTENSIONS = {
  __proto__: null,
  script: 'js',
  module: 'mjs',
};

const initial = new Map([
  ['code', 'print(\'Hello, World!\');'],
  ['mode', 'script'],
  ['features', new Set()],
]);

let state;

if (query.has('gist')) {
  initial.set('gist', query.get('gist'));
  state = fetch(`https://api.github.com/gists/${query.get('gist')}`)
    .then((r) => r.json())
    .then((data) => {
      if (data.files['state.json']) {
        const save = JSON.parse(data.files['state.json'].content);
        const file = data.files[`code.${EXTENSIONS[save.mode]}`];
        initial.set('code', file.content);
        initial.set('mode', save.mode);
        initial.set('features', new Set(save.features));
      } else {
        const fileName = Object.keys(data.files)[0];
        const file = data.files[fileName];
        initial.set('code', file.content);
        if (fileName.endsWith('.mjs')) {
          initial.set('mode', 'module');
        }
      }
      return initial;
    })
    .catch((e) => {
      console.error('Failed to load gist data', e); // eslint-disable-line no-console
      return initial;
    });
} else {
  if (query.has('code')) {
    initial.set('code', LZString.decompressFromBase64(query.get('code')));
  }
  if (query.has('mode')) {
    initial.set('mode', query.get('mode'));
  }
  if (query.has('features')) {
    initial.set('features', new Set(query.get('features').split(',')));
  }
  state = Promise.resolve(initial);
}

export function getState(name) {
  return state
    .then((s) => {
      if (name === undefined) {
        return s;
      }
      return s.get(name);
    });
}

export function updateState() {
  return state
    .then((s) => {
      const params = new URLSearchParams();
      if (s.has('gist')) {
        params.set('gist', s.get('gist'));
      } else {
        params.set('code', LZString.compressToBase64(s.get('code')));
        params.set('mode', s.get('mode'));
        params.set('features', [...s.get('features')].join(','));
      }
      document.location.hash = params.toString();
    });
}

export function setState(name, value) {
  return state
    .then((s) => {
      s.set(name, value);
    })
    .then(() => updateState());
}

const saveSpan = document.querySelector('#save-to-gist-output');
document.querySelector('#save-to-gist')
  .addEventListener('click', () => {
    saveSpan.textContent = 'Saving...';
    state.then((s) => fetch('https://api.engine262.js.org/gist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: s.get('code'),
        state: {
          mode: s.get('mode'),
          features: [...s.get('features')],
        },
      }),
    })
      .then((r) => r.text())
      .then((id) => {
        s.set('gist', id);
        saveSpan.textContent = `Saved! ${id}`;
        return updateState();
      }))
      .catch((e) => {
        saveSpan.textContent = `Error saving to gist: ${e.message}`;
      });
  });
