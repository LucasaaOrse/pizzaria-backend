const express = require('express');
const ProductsController = require('../../controllers/products/ProductsController');
const upload = require("../../config/multer");

const router = express.Router();

module.exports = (db) => {
  // Criar produto com upload da imagem
  router.post("/", (req, res) => {
    ProductsController.createProduct(req, res, db);
    });

  // Atualizar produto
  router.put("/:id", (req, res) => {
    ProductsController.updateProduct(req, res, db);
  });

  // Listar todos os produtos com receitas embutidas
  router.get("/all-with-recipes", (req, res) => {
    ProductsController.listAllWithRecipes(req, res, db);
  });

  // ✅ Listar todos os produtos (simplificado)
  router.get("/all", (req, res) => {
    ProductsController.listAllProducts(req, res, db);
  });

  // ✅ Obter produto por ID
  router.get("/:id", (req, res) => {
    ProductsController.getProductById(req, res, db);
  });

  // Listar por categoria com disponibilidade
  router.get("/", (req, res) => {
    ProductsController.listByCategoryWithAvailability(req, res, db);
  });

  // Deletar produto
  router.delete("/:id", (req, res) => {
    ProductsController.deleteProduct(req, res, db);
  });

  return router;
};