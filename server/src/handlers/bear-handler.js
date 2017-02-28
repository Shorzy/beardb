function createBearHandler(store) {
  return {
    save(req, res) {
      const bearDoc = req.body;
      bearDoc.type = 'bear';
      store.saveBear(bear);
      res.send();
    },
    get(req, res) {
      store.getBears().then((bears) => {
        res.json(bears);
      });
    }
  };
}

module.exports = { createBearHandler };