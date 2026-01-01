import lzString from 'https://cdn.jsdelivr.net/npm/lz-string@1.5.0/+esm';
import { X } from './helpers.mjs';

export function applyDevtoolsPreference() {
  localStorage.setItem('disable-self-xss-warning', 'true');
  if (localStorage.getItem('console-show-settings-toolbar') === null) {
    localStorage.setItem('console-show-settings-toolbar', 'true');
  }
  if (localStorage.getItem('experiments') === null) {
    localStorage.setItem('experiments', '{"protocol-monitor":true}');
  }
  if (localStorage.getItem('engine262:decorators') === null) {
    localStorage.setItem('engine262:decorators', 'true');
  }
}

// playground sharable state
export const search = new URLSearchParams(location.hash.slice(1));
location.hash = '';
export const state = new Proxy(
  {
    mode: search.get('mode'),
    code: search.has('code')
      ? (lzString.decompressFromBase64(X(search.get('code'))) || '')
      : '',
    features: search.has('feature') ? search.getAll('feature') : undefined,
  },
  {
    set(target, key, value) {
      if (key === 'code') {
        search.set('code', lzString.compressToBase64(value));
      } else if (key === 'features') {
        search.delete('feature');
        for (const feature of value) search.append('feature', feature);
      } else if (key === 'mode') {
        search.set(key, value);
      }
      return Reflect.set(target, key, value);
    },
  }
);
