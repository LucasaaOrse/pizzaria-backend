const express = require("express")
const OrderController = require("../../controllers/orders/ordersController")


const router = express.Router()

module.exports = (db) =>{

    router.post("/", async (req, res) =>{
        await OrderController.createOrder(req, res, db)
    } ),

    router.delete("/", async (req, res) =>{
        await OrderController.deleteOrder(req, res, db)
    }),

    router.get("/", async (req, res) =>{
        await OrderController.getAllOrders(req, res, db)
    }),

    router.put("/send", async (req, res) =>{
        await OrderController.sendOrder(req, res, db)
    }),

    router.get("/pending", async (req, res) =>{
        await OrderController.getPendingOrders(req, res, db)
    }),

    router.put('/', async (req, res) =>{
        await OrderController.finishOrder(req, res, db)
    })


    return router
}