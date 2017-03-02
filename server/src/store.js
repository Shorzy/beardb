function createStore(db) {
  return {
    saveBear(bear) {
      return db.insert(bear);
    },
    getBears() {
      return db.view('views', 'bears').spread((res) => {
        return res.rows.map((row) => {
          return row.value;
        });
      });
    }
  };
}

module.exports = { createStore };
