const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = {
  createProduct: async (req, res, db) => {
    const { name, description, price, category_id } = req.body;
    const file = req.files?.file;

    if (!name || !description || !price || !category_id || !file) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'produtos' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.data);
      });

      const parsedPrice = parseFloat(price.toString().replace(",", "."));

      const [newProduct] = await db('products')
        .insert({
          name,
          description,
          price: parsedPrice,
          banner: uploadResult.secure_url,
          category_id
        })
        .returning('*');

      return res.status(201).json({ message: "Produto cadastrado", newProduct });
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      return res.status(500).json({ error: "Erro interno", details: err.message });
    }
  },

  updateProduct: async (req, res, db) => {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;
    const file = req.files?.file;

    if (!id) {
      return res.status(400).json({ error: "ID do produto é obrigatório" });
    }

    try {
      const product = await db('products').where({ id }).first();
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price) updateData.price = parseFloat(price.toString().replace(",", "."));
      if (category_id) updateData.category_id = category_id;

      // Se houver nova imagem, fazer upload e atualizar banner
      if (file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'produtos' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(file.data);
        });

        updateData.banner = uploadResult.secure_url;
      }

      await db('products').where({ id }).update(updateData);

      const updatedProduct = await db('products').where({ id }).first();

      return res.json({ message: "Produto atualizado com sucesso", updatedProduct });
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      return res.status(500).json({ error: "Erro ao atualizar produto", details: error.message });
    }
  },


  listAllWithRecipes: async (req, res, db) => {
  try {
    const products = await db('products').select('*');

    const results = await Promise.all(products.map(async (prod) => {
      const recipe = await db('recipes')
        .where({ product_id: prod.id })
        .join('stock_items', 'recipes.ingredient_id', 'stock_items.id')
        .select('stock_items.id', 'stock_items.name', 'recipes.quantity', 'stock_items.unit');

      return {
        ...prod,
        price: Number(prod.price),
        recipe
      };
    }));

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar produtos com receitas", details: error.message });
  }
},

  listByCategoryWithAvailability: async (req, res, db) => {
    const category_id = req.query.category;
    if (!category_id) {
      return res.status(400).json({ error: "Categoria inválida" });
    }

    try {
      // 1) Busca produtos da categoria
      const products = await db("products")
        .where({ category_id })
        .select("id", "name", "price", "banner");

      if (products.length === 0) {
        return res.json([]);
      }

      const productIds = products.map(p => p.id);

      // 2) Busca receitas desses produtos
      const recipes = await db("recipes")
        .whereIn("product_id", productIds)
        .select("product_id", "ingredient_id", "quantity");

      // 3) Busca estoque atual dos ingredientes usados
      const ingredientIds = [...new Set(recipes.map(r => r.ingredient_id))];
      const stockRows = await db("stock_items")
        .whereIn("id", ingredientIds)
        .select("id", "quantity");

      const stockMap = Object.fromEntries(
        stockRows.map(i => [i.id, Number(i.quantity)])
      );

      // 4) Calcula disponibilidade por produto
      const result = products.map(prod => {
        const needed = recipes
          .filter(r => r.product_id === prod.id)
          .reduce((acc, { ingredient_id, quantity }) => {
            acc[ingredient_id] = (acc[ingredient_id] || 0) + Number(quantity);
            return acc;
          }, {});

        const missing = Object.entries(needed)
          .filter(([ingId, reqQty]) => (stockMap[ingId] || 0) < reqQty)
          .map(([ingId, reqQty]) => ({
            ingredient_id: Number(ingId),
            required: reqQty,
            available: stockMap[ingId] || 0
          }));

        return {
          id: prod.id,
          name: prod.name,
          price: Number(prod.price),
          available: missing.length === 0,
          missing
        };
      });

      return res.json(result);
    } catch (err) {
      console.error("Erro em listByCategoryWithAvailability:", err);
      return res.status(500).json({
        error: "Erro ao buscar produtos",
        details: err.message
      });
    }
  },

  deleteProduct: async (req, res, db) => {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: "Id do produto inválido" });
    }

    try {
      const product = await db("products").where({ id }).first();

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      await db("products").where({ id }).del();

      return res.status(200).json({
        message: "Produto deletado com sucesso",
        product
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }
  },

  // Nova rota para listar todos produtos (simplificado)
  listAllProducts: async (req, res, db) => {
    try {
      const products = await db("products").select("id", "name", "price", "banner", "category_id");
      const result = products.map(p => ({
        ...p,
        price: Number(p.price) // <- converte string para número
      }));
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao listar produtos", details: err.message });
    }
  },

  // Nova rota para obter detalhes de um produto pelo ID (útil para edição)
  getProductById: async (req, res, db) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id do produto inválido" });
    }

    try {
      const product = await db("products").where({ id }).first();
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      product.price = Number(product.price);
      return res.json(product);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar produto", details: err.message });
    }
  },
};
