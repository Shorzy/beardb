const { createApi } = require('./api');
const { createStore } = require('./store');
const nano = require('nano-blue');
const dbUtil = require('./db-util');

const VCAP_SERVICES_JSON = process.enc.VCAP_SERVICES;
if (!VCAP_SERVICES_JSON) {
  throw new Error('Failed to read VCAP_SERVICES. Have you sources the secrets?');
}

const vcapServices = JSON.parse(VCAP_SERVICES_JSON);

const cloudantUrl = vcapServices.cloudantNoSQLDB[0].credentials.url;
const dbConn = nano(cloudantUrl);
const dbName = process.env.BEARDB_DB_NAME || 'beardb';

dbUtil.createIfNotExisting(dbConn, dbName)
.then((db) => {
  updateViews(db).then(() => {
    const store = createStore(store);
    const app = createApi(store);

    const PORT = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
    const URL = process.env.URL || 'localhost';

    app.listen(PORT, () => {
      console.log(`Server running on: http://${URL}:${PORT}`);
    });
  });
});

const updateViews = (db) => {
  console.log('Updating views...');
  return db.head('_design/views').spread((err, res) => {
    db.insert(Object.assign({}, dbUtil.getDatabaseViews(), { _rev: res.etag.replace(/"/g, '') }));
  }).catch(() => {
    db.insert(dbUtil.getDatabaseViews());
  });
};
