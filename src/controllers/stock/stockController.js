// controllers/StockController.js
module.exports = {
  // já existente: listar tudo
  async index(req, res, db) {
    try {
      const items = await db('stock_items as s')
        .leftJoin('stock_item_types as t', 's.type_id', 't.id')
        .select('s.*', 't.name as type_name')
        .orderBy('s.name');
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar estoque', details: error.message });
    }
  },

  // GET /stock/:id
  async show(req, res, db) {
    const { id } = req.params;
    try {
      const item = await db('stock_items').where({ id }).first();
      if (!item) return res.status(404).json({ error: 'Item não encontrado' });
      return res.json(item);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar item', details: error.message });
    }
  },

  // POST /stock
  async create(req, res, db) {
  const { name, unit, quantity, type_id, minimum_quantity } = req.body;

  if (!name || !unit || quantity == null || !type_id || minimum_quantity == null) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const exists = await db('stock_items').where({ name }).first();
    if (exists) {
      return res.status(400).json({ error: 'Item já cadastrado' });
    }

    const result = await db('stock_items')
      .insert({ name, unit, quantity, type_id, minimum_quantity })
      .returning('id');

    const id = Array.isArray(result)
      ? (typeof result[0] === 'object' ? result[0].id : result[0])
      : result;

    return res.status(201).json({ id, name, unit, quantity, type_id, minimum_quantity });
  } catch (error) {
    console.error("Erro ao criar item:", error);
    return res.status(500).json({
      error: 'Erro ao criar item',
      details: error.message
    });
  }
},

  async update(req, res, db) {
  const { id } = req.params;
  const { name, unit, type_id, minimum_quantity } = req.body;

  try {
    const item = await db('stock_items').where({ id }).first();
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });

    await db('stock_items')
      .where({ id })
      .update({ name, unit, type_id, minimum_quantity, updated_at: db.fn.now() });

    const updated = await db('stock_items').where({ id }).first();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar item', details: error.message });
  }
},

  // DELETE /stock/:id
  async delete(req, res, db) {
    const { id } = req.params;
    try {
      const item = await db('stock_items').where({ id }).first();
      if (!item) return res.status(404).json({ error: 'Item não encontrado' });
      await db('stock_items').where({ id }).del();
      return res.json({ message: 'Item removido do estoque', id });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar item', details: error.message });
    }
  },

  // GET /stock/types
  async types(req, res, db) {
    try {
      const rows = await db('stock_items').distinct('type');
      const types = rows.map(r => r.type);
      return res.json(types);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar tipos', details: error.message });
    }
  },

  // GET /stock/low?threshold=NUM
  async lowStock(req, res, db) {
    const threshold = Number(req.query.threshold) || 5;
    try {
      const items = await db('stock_items')
        .where('quantity', '<=', threshold)
        .orderBy('quantity', 'asc');
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar estoque baixo', details: error.message });
    }
  },

  // POST /stock/bulk-add
  async bulkAdd(req, res, db) {
    const { items } = req.body; // [{ id, quantity }, ...]
    if (!Array.isArray(items) || items.some(i => !i.id || i.quantity == null)) {
      return res.status(400).json({ error: 'Payload inválido' });
    }
    const trx = await db.transaction();
    try {
      for (const { id, quantity } of items) {
        if (quantity <= 0) throw new Error('Quantidade deve ser > 0');
        const row = await trx('stock_items').where({ id }).first();
        if (!row) throw new Error(`Item ${id} não encontrado`);
        await trx('stock_items')
          .where({ id })
          .update({ quantity: Number(row.quantity) + Number(quantity) });
      }
      await trx.commit();
      return res.json({ message: 'Estoque atualizado em lote' });
    } catch (error) {
      await trx.rollback();
      return res.status(400).json({ error: error.message });
    }
  },

  // POST /stock/bulk-remove
  async bulkRemove(req, res, db) {
    const { items } = req.body; // [{ id, quantity }, ...]
    if (!Array.isArray(items) || items.some(i => !i.id || i.quantity == null)) {
      return res.status(400).json({ error: 'Payload inválido' });
    }
    const trx = await db.transaction();
    try {
      for (const { id, quantity } of items) {
        if (quantity <= 0) throw new Error('Quantidade deve ser > 0');
        const row = await trx('stock_items').where({ id }).first();
        if (!row) throw new Error(`Item ${id} não encontrado`);
        if (row.quantity < quantity) throw new Error(`Estoque insuficiente em ${id}`);
        await trx('stock_items')
          .where({ id })
          .update({ quantity: Number(row.quantity) - Number(quantity) });
      }
      await trx.commit();
      return res.json({ message: 'Estoque decrementado em lote' });
    } catch (error) {
      await trx.rollback();
      return res.status(400).json({ error: error.message });
    }
  }
};
