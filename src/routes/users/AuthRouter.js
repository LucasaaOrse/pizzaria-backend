const express = require("express")
const AuthController = require("../../controllers/users/AuthController")

const router = express.Router()

module.exports = (db) => {
    router.post("/", async (req, res) =>{
        await AuthController.authUser(req, res, db)
    })

    return router
}

