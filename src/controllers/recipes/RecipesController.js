module.exports = {
  // Cria ou atualiza toda a receita (substitui os ingredientes)
  create: async (req, res, db) => {
    const { product_id } = req.params;
    const { ingredients } = req.body;
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "A receita deve conter ao menos um ingrediente" });
    }

    try {
      await db('recipes').where({ product_id }).del();

      const insertData = ingredients.map(item => ({
        product_id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
      }));

      await db('recipes').insert(insertData);

      return res.status(201).json({ message: "Receita cadastrada com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },

  // Mostra todos os ingredientes da receita de um produto
  show: async (req, res, db) => {
    const { product_id } = req.params;
    try {
      const recipe = await db('recipes')
        .where({ product_id })
        .join('ingredients', 'recipes.ingredient_id', 'ingredients.id')
        .select(
          'recipes.id',
          'recipes.product_id',
          'ingredients.id as ingredient_id',
          'ingredients.name',
          'recipes.quantity',
          'ingredients.unit'
        );
      return res.json(recipe);
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },

  // Adiciona um ingrediente na receita (sem apagar os anteriores)
  addIngredient: async (req, res, db) => {
    const { product_id } = req.params;
    const { ingredient_id, quantity } = req.body;
    if (!ingredient_id || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Dados inválidos" });
    }
    try {
      const exists = await db('recipes').where({ product_id, ingredient_id }).first();
      if (exists) {
        return res.status(400).json({ error: "Ingrediente já existe na receita" });
      }
      const [id] = await db('recipes').insert({ product_id, ingredient_id, quantity });
      return res.status(201).json({ message: "Ingrediente adicionado", id });
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },

  // Remove um ingrediente da receita pelo id da receita
  removeIngredient: async (req, res, db) => {
    const { id } = req.params;
    try {
      const deleted = await db('recipes').where({ id }).del();
      if (deleted === 0) {
        return res.status(404).json({ error: "Ingrediente não encontrado" });
      }
      return res.json({ message: "Ingrediente removido" });
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  },

  // Atualiza a quantidade de um ingrediente na receita
  updateIngredient: async (req, res, db) => {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Quantidade inválida" });
    }
    try {
      const updated = await db('recipes').where({ id }).update({ quantity, updated_at: new Date() });
      if (updated === 0) {
        return res.status(404).json({ error: "Ingrediente não encontrado" });
      }
      return res.json({ message: "Quantidade atualizada" });
    } catch (error) {
      return res.status(500).json({ error: "Erro do servidor", details: error.message });
    }
  }
};
