'use strict';

const http = require('http');
const fetch = require('node-fetch');

const AUTH = `Basic ${Buffer.from(`engine262-bot:${process.env.GH_TOKEN}`).toString('base64')}`;

const EXTENSIONS = {
  script: 'js',
  module: 'mjs',
  __proto__: null,
};

function createGist(content, mode) {
  const name = `code.${EXTENSIONS[mode]}`;
  return fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: { [name]: { content } },
      description: 'Code shared from https://engine262.js.org',
      public: false,
    }),
  })
    .then((r) => r.json());
}

const server = http.createServer((req, res) => {
  if (req.headers.origin !== 'https://engine262.js.org') {
    res.writeHead(403);
    res.end('403');
    return;
  }
  if (req.url !== '/gist') {
    res.writeHead(404);
    res.end('404');
    return;
  }
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('405');
    return;
  }
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    const { content, mode } = JSON.parse(body);
    createGist(content, mode)
      .then((data) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      }, (e) => {
        console.error(e); // eslint-disable-line no-console
        res.writeHead(500);
        res.end('500');
      });
  });
});

server.listen(5000);
