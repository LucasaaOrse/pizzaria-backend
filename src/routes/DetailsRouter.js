const express = require("express")
const DetailsController = require("../controllers/DetailsController")

const router = express.Router();

module.exports = (db) => {

    router.get('/', async (req, res) =>{
        await DetailsController.detailUser(req, res, db)
    })

    return router
}