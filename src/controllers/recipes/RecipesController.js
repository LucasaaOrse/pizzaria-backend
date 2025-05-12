

module.exports = {
  async create(req, res, db) {
    const { product_id } = req.params
    const { ingredients } = req.body

    if(!Array.isArray(ingredients) || ingredients.length === 0){
      return res.status(400).json({error: "A receita deve conter ao menos um ingrediente"})
    }

    try {
      await db('recipes').where({ product_id }).del()

      const insertData = ingredients.map(item => ({
        product_id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity
      }))

      await db('recipes').insert(insertData)

      return res.status(201).json({message: "Receita cadastrada com sucesso"})

    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }

  },

  async show(req, res, db) {
    const { product_id } = req.params

    try {
      const recipe = await db('recipes')
      .where({ product_id })
      .join('ingredients', 'recipes.ingredient_id', 'ingredients.id')
      .select(
        'ingredients.id as ingredient_id',
        'ingredients.name',
        'recipes.quantity',
        'ingredients.unit'
      )

      return res.json(recipe)
    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }
  }
}
