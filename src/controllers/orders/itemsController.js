
module.exports = {
    createItem: async (req, res, db) => {
        const { order_id, product_id, amount } = req.body;
      
        if (!order_id || !product_id || !amount) {
          return res.status(400).json({ error: "Informações informadas inválidas" });
        }
      
        try {
          const existingItem = await db("items")
            .where({ order_id, product_id })
            .first();
      
          if (existingItem) {
            // Atualiza a quantidade somando a nova
            const newAmount = existingItem.amount + amount;
      
            const [updatedItem] = await db("items")
              .where({ id: existingItem.id })
              .update({ amount: newAmount, updated_at: new Date() })
              .returning("*");
      
            return res.status(200).json({
              message: "Quantidade atualizada com sucesso",
              item: updatedItem,
            });
          }
      
          // Caso não exista, insere um novo item
          const [newItem] = await db("items")
            .insert({
              amount,
              order_id,
              product_id,
            })
            .returning("*");
      
          return res.status(201).json({
            message: "Item adicionado com sucesso",
            id: newItem.id,
          });
      
        } catch (error) {
          console.error("Erro ao adicionar item:", error);
          return res.status(500).json({
            error: "Erro ao adicionar produto",
            details: error.message,
          });
        }
      },          

      // controllers/orders/itemsController.js
removeItem: async (req, res, db) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: "ID do item não informado" });

  try {
    const item = await db("items").where({ id }).first();
    if (!item) return res.status(404).json({ error: "Item não encontrado" });

    if (item.amount > 1) {
      const [updated] = await db("items")
        .where({ id })
        .update(
          { amount: item.amount - 1, updated_at: new Date() },
          ["id", "amount"] // returning
        );
      return res.json({
        action: "decrement",
        item_id: updated.id,
        amount: updated.amount
      });
    } else {
      await db("items").where({ id }).del();
      return res.json({
        action: "delete",
        item_id: id
      });
    }
  } catch (error) {
    console.error("Erro ao remover item:", error);
    return res.status(500).json({ error: "Erro ao remover item", details: error.message });
  }
},


    getAllItems: async (req, res,db) =>{
        try {
            
            const items = await db('items').select("*")

            return res.status(200).json({items})

        } catch (error) {
            return res.status(500).json({error: "Erro ao buscar todos os itens"})
        }
    }

}

