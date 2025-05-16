const express = require("express")
const router = express.Router();

const TypeController = require("../../controllers/types/TypesController");

module.exports = (db) => {

  router.get("/", async (req, res) => {
  await TypeController.index(req, res, db)
  });
  router.post("/", async (req, res) => {
    await TypeController.create(req, res, db)
  });
  router.delete("/:id", async (req, res) => {
    await TypeController.delete(req, res, db)
  });

  return router
}

