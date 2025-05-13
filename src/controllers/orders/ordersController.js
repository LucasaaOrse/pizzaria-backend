const { getIO } = require('../../socket');

module.exports = {
    createOrder: async (req, res, db) => {
    const { table, name } = req.body;

    if (!table || typeof table !== "number") {
      return res.status(400).json({ error: "Número de mesa inválido" });
    }

    try {
      // Insere com draft=true (pedido ainda em montagem) e status=false (não finalizado)
      const [newOrder] = await db('orders')
        .insert({ table, name: name || null, draft: true, status: false })
        .returning("*");

      // Normaliza booleans
      newOrder.status = Boolean(newOrder.status);
      newOrder.draft  = Boolean(newOrder.draft);

      // Emite para todos os clientes conectados (cozinha) que há um novo pedido
      const io = getIO();
      io.emit('newOrder', newOrder);
      console.log('Emitido newOrder para sala geral:', newOrder.id);

      return res
        .status(201)
        .json({ message: "Pedido feito com sucesso", order: newOrder });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return res
        .status(500)
        .json({ error: "Erro ao criar pedido", details: error.message });
    }
  },

    deleteOrders: async (req, res, db) => {
    const { ids } = req.body;

    // Validação básica
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: "Envie um array de IDs não vazio no campo 'ids'." });
    }

    // Converter para números (caso venham como string)
    const parsedIds = ids.map((i) => Number(i)).filter((i) => !isNaN(i));

    if (parsedIds.length === 0) {
      return res
        .status(400)
        .json({ error: "IDs inválidos no array." });
    }

    try {
      // Busca as orders antes de deletar
      const ordersToDelete = await db("orders")
        .whereIn("id", parsedIds);

      if (ordersToDelete.length === 0) {
        return res
          .status(404)
          .json({ error: "Nenhuma order encontrada com esses IDs." });
      }

      // Deleta de fato
      await db("orders")
        .whereIn("id", parsedIds)
        .del();

      return res.status(200).json({
        message: "Orders deletadas com sucesso",
        deleted: ordersToDelete.length,
        orders: ordersToDelete
      });
    } catch (error) {
      console.error("Erro ao deletar orders:", error);
      return res
        .status(500)
        .json({ error: "Erro ao deletar orders", details: error.message });
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

    sendOrder: async (req, res, db) => {
    const { id } = req.body;
    console.log('ID do pedido:', id);
    try {
      const order = await db('orders').where({ id }).first();
      if (!order) return res.status(404).json({ error: 'Pedido não existe' });

      await db('orders').where({ id }).update({ draft: false });
      const updateOrder = await db('orders').where({ id }).first();
      console.log('Pedido atualizado:', updateOrder);

      // Emite via socket
      getIO().emit('newOrder', updateOrder);

      return res.status(200).json({ message: 'Pedido enviado com sucesso', order: updateOrder });
    } catch (error) {
      console.error('❌ Erro ao enviar pedido:', error);
      return res.status(500).json({ error: 'Erro interno ao finalizar pedido', details: error.message });
    }
  },

    getPendingOrders: async (req, res, db) => {
    try {
      // Traz tudo que ainda não foi finalizado (status = false),
      // seja em montagem (draft = true) ou já confirmado (draft = false)
      const pendingOrders = await db('orders')
        .where({ status: false })
        .orderBy("created_at", "asc");

      return res.status(200).json(pendingOrders);
    } catch (error) {
      console.error("Erro ao listar pedidos pendentes:", error);
      return res
        .status(500)
        .json({ error: "Erro ao listar pedidos pendentes", details: error.message });
    }
  },


    finishOrder: async (req, res, db) => {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: "Order invalida" });

    try {
      const order = await db('orders').where({ id: order_id }).first();
      if (!order) return res.status(404).json({ error: "Order não encontrada" });

      await db('orders').where({ id: order_id }).update({ status: true });
      const orderUpdate = await db('orders').where({ id: order_id }).first();

      const io = getIO(); // ✅ PEGAR a instância correta do socket
      console.log("Pedido finalizado, emitindo evento orderFinished:", order_id);
      io.emit("orderFinished", { id: order_id }); // ✅ Agora vai funcionar!

      return res.status(200).json({
        message: "Pedido finalizado com sucesso",
        orderUpdate
      });
    } catch (error) {
      return res.status(500).json({
        error: "Erro ao finalizar pedido",
        details: error.message
      });
    }
  },

}