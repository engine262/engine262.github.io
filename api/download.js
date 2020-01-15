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
  return fetch('https://npm.pkg.github.com/@engine262/engine262', {
    headers: { ...req.headers, authorization },
  })
    .then((r) => r.json())
    .then((r) => {
      const link = r.versions[r['dist-tags'].latest].dist.tarball;
      return fetch(link, {
        redirect: 'manual',
        headers: { authorization },
      }).then((r2) => {
        res.status(302);
        res.setHeader('location', r2.headers.get('location'));
        return res.end();
      });
    });
};
