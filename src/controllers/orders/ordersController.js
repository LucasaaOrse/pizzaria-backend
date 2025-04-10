

module.exports = {
    createOrder: async (req, res, db) =>{
        const { table, name } = req.body

        if (!table || typeof table !== "number") {
            return res.status(400).json({ error: "Número de mesa inválido" });
        }
        try {
            const [newOrder] = await db('orders').insert({ table: table, name: name || null }).returning("*")

            newOrder.status = Boolean(newOrder.status);
            newOrder.draft = Boolean(newOrder.draft);

            res.status(201).json({ message: "Pedido feito com sucesso", order: newOrder })
        } catch (error) {
            console.log("Erro ao criar pedido")
            return res.status(500).json({error: "Erro ao criar pedido", details: error.message})
        }
    },

    deleteOrder: async (req, res, db) => {
        const { table } = req.query;

        if (!table) {
            return res.status(400).json({ error: "Número da mesa inválido" });
        }

        try {
            // Buscar o pedido antes de deletar
            const orderToDelete = await db("orders").where({ table }).first();

            if (!orderToDelete) {
                return res.status(404).json({ error: "Pedido não encontrado" });
            }

            // Deletar o pedido
            await db("orders").where({ table }).del();

            return res.status(200).json({
                message: "Pedido deletado com sucesso",
                order: orderToDelete
            });

        } catch (error) {
            return res.status(500).json({ error: "Erro ao deletar pedido", details: error.message });
        }
    },

    getAllOrders: async (req, res, db) =>{
        
        try {
            const orders = await db('orders').select("*")
            return res.status(200).json({orders})
        } catch (error) {
            return res.status(500).json({error: "Erro ao listar as orders", details: error.message})
        }

    },

    sendOrder: async (req, res, db) =>{
        const { id } = req.body

        try {
            const order = await db('orders').where({ id }).first();
            
            if(!order){
                return res.status(404).json({ error: "Pedido não existe" })
            }

            await db('orders').where({ id }).update({ draft: false})
            
            const updateOrder = await db('orders').where({ id }).first()

            return res.status(200).json({ message: "Pedido enviado com sucesso", order: updateOrder })
        } catch (error) {
            return res.status(500).json({error: "Erro ao enviar pedido", details: error.message})            
        }
    },

    getPendingOrders: async (req, res, db) =>{

        try {
            
            const pendingOrders = await db('orders')
            .where({ draft: false, status: false })
            .orderBy("created_at", "asc")

            return res.status(200).json(pendingOrders)

        } catch (error) {
            return res.status(500).json({error: "Erro ao listar pedidos pendentes", details: error.message})
        }
    },

    finishOrder: async (req, res, db) =>{
        const { order_id } = req.body

        if(!order_id){
            return res.status(400).json({error: "Order invalida"})
        }

        try {
            
            const order = await db('orders').where({ id: order_id }).first()

            if(!order){
                return res.status(404).json({ error: "Order não encontrada"})
            }

            await db('orders').where({id: order_id}).update({status: true})
            
            const orderUpdate = await db('orders').where({id: order_id}).first()

            return res.status(200).json({message: "Pedido finalizado com sucesso", orderUpdate})
        } catch (error) {
            return res.status(500).json({ error: "Erro ao finalizar pedido", details: error.message });
        }
    }
}