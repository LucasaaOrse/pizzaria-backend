// routes/stockRoutes.js
const express = require('express');
const StockController = require('../../controllers/stock/stockController');
module.exports = (db) => {
  const router = express.Router();

  router.get('/',      (req, res) => StockController.index(req, res, db));
  router.get('/types', (req, res) => StockController.types(req, res, db));
  router.get('/low',   (req, res) => StockController.lowStock(req, res, db));
  router.post('/',     (req, res) => StockController.create(req, res, db));
  router.get('/:id',   (req, res) => StockController.show(req, res, db));
  router.put('/:id',   (req, res) => StockController.update(req, res, db));
  router.delete('/:id',(req, res) => StockController.delete(req, res, db));
  router.post('/bulk-add',    (req, res) => StockController.bulkAdd(req, res, db));
  router.post('/bulk-remove', (req, res) => StockController.bulkRemove(req, res, db));

  return router;
};
