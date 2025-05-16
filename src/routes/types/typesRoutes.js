const express = require("express")
const router = express.Router();

const TypeController = require("../../controllers/types/TypesController");

module.exports = (db) => {
  router.get("/types", async (req, res) => {
  await TypeController.index(req, res, db)
  });
  router.post("/types", async (req, res) => {
    await TypeController.create(req, res, db)
  });
  router.delete("/types/:id", async (req, res) => {
    await TypeController.delete(req, res, db)
  });

}

