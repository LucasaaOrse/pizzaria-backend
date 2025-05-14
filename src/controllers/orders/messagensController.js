
module.exports = {
  getmessages: async (req, res, db) => {
    const { orderId } = req.params;
    try {
      const msgs = await db('messages')
        .where('order_id', orderId)
        .orderBy('timestamp', 'asc');

      return res.json(msgs);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }

  }
}
