

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
    // Upload da imagem
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'produtos' }, // opcional: pasta no Cloudinary
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.data); // envia os bytes da imagem
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
  .returning('*'); // retorna todas as colunas


    return res.status(201).json({ message: "Produto cadastrado", newProduct });
  } catch (err) {
    console.error("Erro ao cadastrar produto:", err);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
      },
           

    async listByCategoryWithAvailability(req, res, db) {
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
      const stockRows = await db("ingredients")
        .whereIn("id", ingredientIds)
        .select("id", "quantity");

      const stockMap = Object.fromEntries(
        stockRows.map(i => [i.id, Number(i.quantity)])
      );

      // 4) Calcula disponibilidade por produto
      const result = products.map(prod => {
        // total necessário de cada ingrediente
        const needed = recipes
          .filter(r => r.product_id === prod.id)
          .reduce((acc, { ingredient_id, quantity }) => {
            acc[ingredient_id] = (acc[ingredient_id] || 0) + Number(quantity);
            return acc;
          }, {});

        // identifica faltas
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
          price: prod.price,
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

    deleteProduct: async (req, res, db) =>{
        const { id } = req.body

        if(!id){
            return res.status(404).json({error: "Id do produto invalido"})
        }

        try {
            const delelteProduct = await db("products").where({id}).first()

            if(!delelteProduct){
                return res.status(404).json({error: "Produto não encontrado"})
            }

            await db("products").where({id}).del()

            return res.status(200).json({
                message: "Produto deletado com sucesso",
                product: delelteProduct
            })
        } catch (error) {
            return res.status(500).json({error: "Erro ao deletar produto"})
        }
        
    }
};
