
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports = {
    authUser: async (req, res, db) =>{
        const { email, password } = req.body

        try {
            const user = await db("users").where({ email }).first();

            if(!user){
                return res.status(400).json({ error: "Usuario não encontrado"})
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if(!isPasswordValid){
                return res.status(400).json({error: "Email/Senha incorreta"})
            }

            const token = jwt.sign({name: user.name, email: user.email, subject: user.id, }, process.env.SECRET_KEY,  { expiresIn: "1h"})
            return res.status(200).json({menssagem: "Login bem-sucedido", id: user.id, name: user.name, email: user.email, token})
        } catch (error) {
            return res.status(500).json({error: "Erro do serdidor"})               
        }

    }
}