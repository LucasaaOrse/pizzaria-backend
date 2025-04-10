const express = require("express")
const ItemsController = require("../../controllers/orders/itemsController")

const router = express.Router()

module.exports = (db) =>{

    router.post("/", async (req, res) =>{
        await ItemsController.createItem(req, res, db)
    }),

    router.delete("/", async (req, res) =>{
        await ItemsController.removeItem(req, res, db)
    }),

    router.get("/", async (req, res) =>{
        await ItemsController.getAllItems(req, res, db)
    })

    return router
}
