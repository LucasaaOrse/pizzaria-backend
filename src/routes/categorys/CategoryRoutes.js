const express = require("express")
const CategoryController = require("../../controllers/category/CategoryController")

const router = express.Router()

module.exports = (db) => {

    router.post("/", async (req, res) => {
        await CategoryController.createCategory(req, res, db)
    }),

    router.get('/', async (req, res) =>{
        await CategoryController.getAllCategorys(req, res, db)
    }),

    router.delete('/', async (req, res) => {
        await CategoryController.deleteCategory(req, res, db)
    })

    return router
}