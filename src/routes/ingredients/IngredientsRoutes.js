const express = require("express")
const IngredientsController = require('../../controllers/ingredients/IngredientsController')

const router = express.Router()

module.exports = (db) => {
  router.get("/", async (req, res) => {
    await IngredientsController.index(req, res, db)
  }),

  router.post('/', async (req, res) => {
    await IngredientsController.create(req, res, db)
  })

  return router
}