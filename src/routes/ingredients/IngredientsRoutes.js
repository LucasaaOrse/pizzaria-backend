const express = require("express")
const IngredientsController = require('../../controllers/ingredients/IngredientsController')

const router = express.Router()

module.exports = (db) => {
  router.get("/", async (req, res) => {
    await IngredientsController.index(req, res, db)
  }),

  router.post('/', async (req, res) => {
    await IngredientsController.create(req, res, db)
  }),

  router.patch('/:id/add', async (req, res) => {
    await IngredientsController.addStock(req, res, db)
  })

  router.patch('/:id/remove', async (req, res) => {
    await IngredientsController.removeStock(req, res, db)
  })

  return router
}