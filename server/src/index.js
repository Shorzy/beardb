const { createApi } = require('./api');
const { createStore } = require('./store');
const nano = require('nano-blue');
const dbUtil = require('./db-util');
const fs = require('fs');

const VCAP_SERVICES_JSON = process.env.VCAP_SERVICES;
let vcapServices;
if (VCAP_SERVICES_JSON) {
  vcapServices = JSON.parse(VCAP_SERVICES_JSON);
} else {
  vcapServices = JSON.parse(fs.readFileSync('./.secrets', 'utf-8'));
}
const cloudantUrl = vcapServices.cloudantNoSQLDB[0].credentials.url;
const dbConn = nano(cloudantUrl);
const dbName = process.env.BEARDB_DB_NAME || 'beardb';

const updateViews = (db) => {
  console.log('Updating views...');
  return db.head('_design/views').spread((err, res) => {
    db.insert(Object.assign({}, dbUtil.getDatabaseViews(), { _rev: res.etag.replace(/"/g, '') }));
  }).catch(() => {
    db.insert(dbUtil.getDatabaseViews());
  });
};

dbUtil.createIfNotExisting(dbConn, dbName)
.then((db) => {
  updateViews(db).then(() => {
    const store = createStore(db);
    const app = createApi(store);

    const PORT = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
    const URL = process.env.URL || 'localhost';

    app.listen(PORT, () => {
      console.log(`Server running on: http://${URL}:${PORT}`);
    });
  });
});

