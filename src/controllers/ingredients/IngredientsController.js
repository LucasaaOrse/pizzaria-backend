

module.exports = {
  async index(req, res) {
    try {
      const ingredients = await knex('ingredients').select('*').orderBy('name');
      return res.json(ingredients);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar ingredientes' });
    }
  },

  async create(req, res, db) {
    const { name, unit, quantity } = req.body

    if(!name || !unit || !quantity === undefined ){
      return res.status(400).json({error: "Todos os campos são obrigatorios"})
    }

    try {
      const existing = await db('ingredients').where({name}).first()
      if(existing){
        return res.status(400).json({error: "Ingrediente já cadastrado"})
      }  
      
      const [id] = await db('ingredients').insert({
        name,
        unit,
        quantity
      })
      return res.status(200).json({id, name, unit, quantity})

    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }
  },
  async addStock(req, res, db) {
    const { id } = req.params
    const { quantity } = req.body

    if(quantity == null || quantity <= 0){
      return res.status(400).json({error: "Quantidade deve ser maior que zero"})
    }

    try {
      const ingredient = await db('ingredients').where({ id }).first()

      if(!ingredient){
        return res.status(404).json({error: "Ingrediente não encontrado"})
      }

      const newQuantity = Number(ingredient.quantity) + Number(quantity)

      await db('ingredients').where({id}).update({quantity: newQuantity})

      return res.status(200).json({ id, name: ingredient.name, newQuantity });

    } catch (error) {
      return res.status(500).json({èrror: "Erro do servidor", details: error.message})
    }
  },

  async removeStock(req, res, db){
    const { id } = req.params
    const { quantity } = req.body

    if(quantity == null || quantity <= 0){
      return res.status(400).json({error: "Quantidade deve ser maior que zero"})
    }

    try {
      const ingredient = await db('ingredients').where({id}).first()
      if(!ingredient){
        return res.status(404).json({error: "Ingrediente não encontrado"})
      }

      if(ingredient.quantity < quantity){
        return res.status(400).json({error: "Estoque insuficiente"})
      }

      const newQuantity = Number(ingredient.quantity) - Number(quantity)

      await db('ingredients').where({id}).uptade({quantity: newQuantity})

      return res.json({id, name: ingredient.name, newQuantity})

    } catch (error) {
      return res.status(500).json({error: "Erro do servidor", details: error.message})
    }
  }

}