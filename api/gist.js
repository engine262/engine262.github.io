'use strict';

const fetch = require('node-fetch');

const AUTH = `Basic ${Buffer.from(`engine262-bot:${process.env.GH_TOKEN}`).toString('base64')}`;

const EXTENSIONS = {
  script: 'js',
  module: 'mjs',
  __proto__: null,
};

function createGist(content, state) {
  const name = `code.${EXTENSIONS[state.mode]}`;
  return fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        [name]: { content },
        'state.json': { content: JSON.stringify(state) },
      },
      description: 'Code shared from https://engine262.js.org',
      public: false,
    }),
  })
    .then((r) => r.json());
}

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, { 'Allow': 'OPTIONS, POST' });
    res.end();
    return res;
  }
  if (req.method !== 'POST') {
    return res.status(405).send('405');
  }
  if (!req.body || !req.body.content || !req.body.state) {
    return res.status(400).send('400');
  }
  return createGist(req.body.content, req.body.state)
    .then((body) => res.status(200).end(body.id));
};
