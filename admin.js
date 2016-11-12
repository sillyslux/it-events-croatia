/* eslint no-console: 0 */

const express = require('express');
const formidable = require('express-formidable');
const eventBlog = require('./backend/eventModule');
const config = require('./config');

const backend = express();

backend.use(formidable());

backend.post('/backend/submit', (req, res) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify({ status: 'success', message: 'hello world' }));
});

backend.post('/createEvent', (req, res) => {
  res.append('Access-Control-Allow-Origin', '*');
  // console.log(req);
  eventBlog.createEvent(req.fields)
  .then(
    data => res.json(data),
    err => res.json({
      status: 'error',
      message: err.toString(),
      error: err.toString(),
      stack: err.stack,
    })
  );
});

backend.get('/eventList', (req, res) =>
  eventBlog.getMonths().then(list => res.json(list))
);

backend.listen(config.port, 'localhost', () => {
  console.log(`Backend Server running on port ${config.port}`);
});
