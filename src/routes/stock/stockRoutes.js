// routes/stockRoutes.js
const express = require('express');
const StockController = require('../../controllers/stock/stockController');
const router = express.Router();

module.exports = (db) => {

  router.get('/', async (req, res) => {
    await StockController.index(req, res, db)
  } );
  router.get('/low', async  (req, res) => {
    await StockController.lowStock(req, res, db)
  } );
  router.post('/', async    (req, res) => {
    await StockController.create(req, res, db)
  } );
  router.get('/:id',  async (req, res) => {
    StockController.show(req, res, db)
  } );
  router.put('/:id',  async (req, res) => {
    await StockController.update(req, res, db)
  } );
  router.delete('/:id', async (req, res) => {
    await StockController.delete(req, res, db)
  } );
  router.post('/bulk-add', async   (req, res) => {
    await StockController.bulkAdd(req, res, db)
  } );
  router.post('/bulk-remove', async (req, res) => {
    await StockController.bulkRemove(req, res, db)
  } );

  return router;
};
