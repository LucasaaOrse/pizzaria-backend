const express = require('express')
const ProductsController = require('../../controllers/products/ProductsController')
const upload = require("../../config/multer")


const router = express.Router()

module.exports = (db) =>{
    //router.post("/", upload.single("file"), async (req, res) =>{
        //await ProductsController.createProduct(req, res, db)
    //})

    router.post("/", async (req, res) =>{
        await ProductsController.createProduct(req, res, db)
    }),

    router.get("/", async (req, res) => {
        await ProductsController.getProductCategory(req, res, db)
    }),

    router.delete("/", async (req, res) => {
        await ProductsController.deleteProduct(req, res, db)
    })

    return router
}
