

module.exports = {
    ordersDetails: async (req, res, db) => {
        const { order_id } = req.query;
    
        if (!order_id) {
            return res.status(400).json({ error: "Order inválida" });
        }
    
        try {
            const items = await db("items")
                .where("items.order_id", order_id)
                .join("products", "items.product_id", "=", "products.id")
                .join("orders", "items.order_id", "=", "orders.id")
                .select(
                    "items.id",
                    "items.amount",
                    "items.created_at",
                    "items.order_id",
                    "items.product_id",
    
                    "products.id as product_id",
                    "products.name as product_name",
                    "products.price",
                    "products.description",
                    "products.banner",
                    "products.category_id",
    
                    "orders.id as order_id",
                    "orders.table",
                    "orders.name as order_name",
                    "orders.draft",
                    "orders.status"
                );
    
            const formatted = items.map(item => ({
                id: item.id,
                amount: item.amount,
                created_at: item.created_at,
                order_id: item.order_id,
                product_id: item.product_id,
                product: {
                    id: item.product_id,
                    name: item.product_name,
                    price: item.price,
                    description: item.description,
                    banner: item.banner,
                    category_id: item.category_id
                },
                order: {
                    id: item.order_id,
                    table: item.table,
                    name: item.order_name,
                    draft: !!item.draft,
                    status: !!item.status
                }
            }));
    
            return res.status(200).json(formatted);
    
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar pedido", details: error.message });
        }
    }



}
