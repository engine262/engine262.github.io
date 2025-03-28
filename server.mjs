/* eslint-disable no-console */
import {
  existsSync, readFileSync,
} from 'fs';
import { parseArgs } from 'util';

const argv = parseArgs({
  options: {
    forceRemote: {
      type: 'boolean',
      short: 'f',
      default: false,
      help: 'Force using remote resources.',
    },
  },
  strict: false,
});
const canUseLocal = !argv.values.forceRemote;
let logged = false;
function logLocalBuild() {
  if (logged) return;
  logged = true;
  console.log(`

    engine262.js.org

Local development requires:
  - lib/chrome-devtools-frontend
    - built from chrome-devtools-frontend (https://www.npmjs.com/package/chrome-devtools-frontend)
    - or download a pre-built version (by third-party) (https://www.npmjs.com/package/chrome-devtools-frontend-build)
  - lib/engine262
    - symbolic link to your engine262 repo (e.g. ../engine262)
    - run \`npm run watch\` in the engine262 repo`);
}
function redirectMissingFile(
  /** @type {import('http').IncomingMessage} */ req,
  /** @type {import('http').ServerResponse} */ res,
  /** @type {(err?: any) => void} */ next,
) {
  if ((req.url === '/next.html') && canUseLocal) {
    if (existsSync('./lib/chrome-devtools-frontend')) {
      const file = readFileSync('./next.html', 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(file.replace(/https:\/\/chrome-devtools-frontend.appspot.com\/serve_rev\/@[0-9a-f]+/, '/lib/chrome-devtools-frontend'));
      return;
    }
    logLocalBuild();
  }
  if (req.url === '/engine262/engine262.mjs') {
    if (canUseLocal && existsSync('./lib/engine262/lib/engine262.mjs')) {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=UTF-8' });
      res.end('export * from "/lib/engine262/lib/engine262.mjs";');
    } else {
      logLocalBuild();
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=UTF-8' });
      res.end('export * from "https://engine262.js.org/engine262/engine262.mjs";');
    }
    return;
  }
  if (req.url === '/engine262/engine262.js') {
    if (canUseLocal && existsSync('./lib/engine262/lib/engine262.js')) {
      res.writeHead(302, { Location: '/lib/engine262/lib/engine262.js' });
      res.end();
    } else {
      logLocalBuild();
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=UTF-8' });
      res.end('export * from "https://engine262.js.org/engine262/engine262.js";');
    }
    return;
  }
  if (req.url === '/engine262/inspector.mjs') {
    if (canUseLocal && existsSync('./lib/engine262/lib/inspector.mjs')) {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=UTF-8' });
      res.end('export * from "/lib/engine262/lib/inspector.mjs";');
    } else {
      logLocalBuild();
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=UTF-8' });
      res.end('export * from "https://engine262.js.org/engine262/inspector.mjs";');
    }
    return;
  }
  next();
}

let count = 2;
// yay, I'd like to reuse http-server's bin, so let's get hacky
// eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'before', {
  get() {
    count -= 1;
    if (count === 0) {
      Reflect.deleteProperty(Object.prototype, 'before');
    }
    return [redirectMissingFile];
  },
  configurable: true,
});
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
await import('http-server/bin/http-server');
