
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports = {
    authUser: async (req, res, db) => {
    const { email, password } = req.body;

    try {
      const user = await db("users").where({ email }).first();
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Email/Senha incorreta" });
      }

      // Gera o token
      const token = jwt.sign(
        { name: user.name, email: user.email, subject: user.id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      // Aqui vamos setar o cookie HTTP‑only
      res
        .cookie("session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
          path: "/",
        })
        .status(200)
        .json({
          mensagem: "Login bem‑sucedido",
          id: user.id,
          name: user.name,
          email: user.email,
        });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ error: "Erro do servidor" });
    }
  },
}