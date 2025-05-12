const express = require("express")
const RecipesController = require('../../controllers/recipes/RecipesController')

const router = express.Router()

module.exports = (db) => {
  router.post('/:product_id', (req, res) => {
    RecipesController.create(req, res, db)
  }),

  router.get('/:product_id', (req, res) => {
    RecipesController.show(req, res, db)
  })

  return router
}