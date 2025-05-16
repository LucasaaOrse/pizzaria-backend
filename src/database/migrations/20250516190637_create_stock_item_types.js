// controllers/stock/TypeController.js
module.exports = {
  // GET /stock/types
  async index(req, res, db) {
    const types = await db("stock_item_types").select("id", "name");
    return res.json(types);
  },

  // POST /stock/types
  async create(req, res, db) {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
    try {
      const [id] = await db("stock_item_types").insert({ name });
      return res.status(201).json({ id, name });
    } catch (err) {
      return res.status(400).json({ error: "Tipo já existe" });
    }
  },

  // DELETE /stock/types/:id
  async delete(req, res, db) {
    const { id } = req.params;
    // opcional: verificar se há items usando esse tipo
    await db("stock_item_types").where({ id }).del();
    return res.json({ message: "Tipo removido" });
  }
};
