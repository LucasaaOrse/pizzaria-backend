// routes/UserRoutes.js

const express = require('express');
const UserController = require('../../controllers/users/UserController');

const router = express.Router();

module.exports = (db) => {
  // Criar um usuário
  router.post('/', async (req, res) => {
    await UserController.createUser(req, res, db);
  });

  router.get("/", async (req, res) =>{
    await UserController.getAllUsers(req, res, db)
  })

  router.put("/:id", async (req, res) =>{
    await UserController.editUser(req, res, db)
  })

  router.delete("/:id", async (req, res) => {
  await UserController.deleteUser(req, res, db);
  });
  router.delete("/:id", async (req, res) => {
  await UserController.deleteUser(req, res, db);
  });

  return router;
  
};
