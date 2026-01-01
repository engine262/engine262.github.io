'use strict';

const fetch = require('node-fetch');

const authorization = `Bearer ${process.env.GH_TOKEN}`;

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, { 'Allow': 'OPTIONS, GET' });
    res.end();
    return res;
  }
  if (req.method !== 'GET') {
    return res.status(405).send('405');
  }

  delete req.headers.host;
  return fetch('https://npm.pkg.github.com/@magic-works/engine262', {
    headers: { ...req.headers, authorization },
  })
    .then((r) => r.json())
    .then((r) => {
      const latest = r['dist-tags'].latest;
      res.status(200);
      return res.json({
        latest,
      });
    });
};
