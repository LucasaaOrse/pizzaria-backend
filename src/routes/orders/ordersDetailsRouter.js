const express = require('express')
const OrdersDetailController = require("../../controllers/orders/ordersDetailsController")

const router = express.Router()

module.exports = (db) => {
    router.get("/", async (req, res) =>{
        await OrdersDetailController.ordersDetails(req, res, db)
    })

    return router

}