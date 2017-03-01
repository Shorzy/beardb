function createIfNotExisting(dbConn, dbName) {
  return dbConn.db.get(dbName)
  .then(() => dbConn.use(dbName))
  .catch(() => dbConn.db.create(dbName))
  .then(() => dbConn.use(dbName));
}

function getDatabaseViews() {
  return {
    _id: '_design/views',
    views: {
      bears: {
        map: function (doc) {
          if (doc.type === 'bear') {
            emit(null, doc);
          }
        }
      }
    }
  };
}

module.exports = { createIfNotExisting, getDatabaseViews };