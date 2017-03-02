const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const { createBearHandler } = require('./handlers/bear-handler');

function createApi(store) {
  const app = express();

  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '..', '..', 'public')));

  const bearHandler = createBearHandler(store);
  app.post('/bears', bearHandler.save);
  app.get('/bears', bearHandler.get);
  return app;
}

module.exports = { createApi };
