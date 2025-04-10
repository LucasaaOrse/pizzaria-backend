// controllers/UserController.js

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  createUser: async (req, res, db) => {
    const { name, email, password } = req.body;
    
    if(email == undefined){
      return res.status(400).json({error: "Email invalido"})
    }
  
  try {

    const emailAreadyExist = await db("users").where({ email }).first()
    if(emailAreadyExist){
      return res.status(400).json({menssagem: "Esse email ja esta em uso, digite um novo email"})
    }

    
      const hashpassword = await bcrypt.hash(password, saltRounds)

      await db('users').insert({ name, email, password: hashpassword});
      res.status(201).json({ menssagem: "Usuario cadastrado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: 'Error inserting user into database' });
    }
  },

  getAllUsers: async (req, res, db) =>{
    try {
      const users = await db('users').select("id", "name", "email");
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({error: "Erro ao receber usuarios da Database"})
    }
  },

  editUser: async (req, res, db) =>{
    const {id} = req.params
    const { name, email } = req.body
    try {
      await db("users").where({ id }).update({ name, email })
      return res.json({menssagem: "Usuario atualizado"})
    } catch (error) {
      return res.status(500).json({error: "Erro ao atualizar usuario"})
    }
    
  },

  deleteUser: async (req, res, db) =>{
    const { id } = req.params
    try {
      await db("users").where({ id }).del()      
      return res.json({ menssagem: "Usuario deletado com sucesso"})
    } catch (error) {
      return res.json({ error: "Erro ao deletar usuario"})
    }

  }
  

};
