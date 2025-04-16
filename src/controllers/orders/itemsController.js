
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
                // Soma a quantidade atual com a nova
                const newAmount = existingItem.amount + amount;
    
                await db("items")
                    .where({ id: existingItem.id })
                    .update({ amount: newAmount });
    
                const updatedItem = await db("items").where({ id: existingItem.id }).first();
    
                return res.status(200).json({
                    message: "Quantidade atualizada com sucesso",
                    item: updatedItem
                });
            }
    
            // Caso não exista, insere novo item
            const [item_id] = await db('items').insert({
                amount,
                order_id,
                product_id
            });
    
            const newItem = await db('items').where({ id: item_id }).first();
    
            return res.status(201).json({
                message: "Produto adicionado com sucesso",
                item: newItem
            });
    
        } catch (error) {
            return res.status(500).json({ error: "Erro ao adicionar produto", details: error.message });
        }
    },    

    removeItem: async (req, res, db) => {
        const { id, decrement } = req.query;
    
        if (!id) {
            return res.status(400).json({ error: "ID do item não informado" });
        }
    
        try {
            const item = await db("items").where({ id }).first();
    
            if (!item) {
                return res.status(404).json({ error: "Item não encontrado" });
            }
    
            if (decrement && item.amount > 1) {
                const newAmount = item.amount - 1;
    
                await db("items")
                    .where({ id })
                    .update({ amount: newAmount });
    
                const updatedItem = await db("items").where({ id }).first();
                return res.status(200).json({
                    message: "Quantidade reduzida com sucesso",
                    item: updatedItem
                });
            }
    
            // Se amount == 1 ou não tiver decrement flag, remove o item
            await db("items").where({ id }).del();
    
            return res.status(200).json({ message: "Item removido com sucesso" });
    
        } catch (error) {
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

