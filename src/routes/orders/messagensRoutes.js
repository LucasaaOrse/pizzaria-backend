const express = require("express")
const MessagensController = require("../../controllers/orders/messagensController")

const router = express.Router()

module.exports = (db) =>{

    router.get("/:orderId", async (req, res) =>{
        await MessagensController.getmessages(req, res, db)
    })

    return router

}