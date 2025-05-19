const express = require("express");
const RecipesController = require('../../controllers/recipes/RecipesController');

const router = express.Router();

module.exports = (db) => {
  router.post('/:product_id', (req, res) => {
    RecipesController.create(req, res, db);
  });

  router.get('/:product_id', (req, res) => {
    RecipesController.show(req, res, db);
  });

  router.post('/:product_id/ingredient', (req, res) => {
    RecipesController.addIngredient(req, res, db);
  });

  router.delete('/ingredient/:id', (req, res) => {
    RecipesController.removeIngredient(req, res, db);
  });

  router.put('/ingredient/:id', (req, res) => {
    RecipesController.updateIngredient(req, res, db);
  });

  return router;
};