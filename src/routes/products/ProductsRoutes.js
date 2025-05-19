const express = require('express');
const ProductsController = require('../../controllers/products/ProductsController');
const upload = require("../../config/multer");

const router = express.Router();

module.exports = (db) => {
  // Criar produto com upload da imagem
  router.post("/", upload.single("file"), (req, res) => {
    ProductsController.createProduct(req, res, db);
  });

  // Atualizar produto (pode ser adaptado para aceitar upload também)
  router.put("/:id", (req, res) => {
    ProductsController.updateProduct(req, res, db);
  });

  // Listar todos produtos com receitas embutidas
  router.get("/all-with-recipes", (req, res) => {
    ProductsController.listAllWithRecipes(req, res, db);
  });

  // Listar por categoria com disponibilidade (sua rota atual)
  router.get("/", (req, res) => {
    ProductsController.listByCategoryWithAvailability(req, res, db);
  });

  // Deletar produto
  router.delete("/", (req, res) => {
    ProductsController.deleteProduct(req, res, db);
  });

  return router;
};