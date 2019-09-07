'use strict';

const fetch = require('node-fetch');

module.exports = (req, res) => fetch(new URL(req.url, 'https://engine262.github.io'))
  .then((r) => r.text())
  .then((body) => {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    return res.end(body);
  })
  .catch((e) => {
    res.writeHead(500);
    return res.end(e.message);
  });
