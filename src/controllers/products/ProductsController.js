

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

    const [product_id] = await db('products').insert({
      name,
      description,
      price: parsedPrice,
      banner: uploadResult.secure_url,
      category_id
    });

    return res.status(201).json({ message: "Produto cadastrado", product_id });
  } catch (err) {
    console.error("Erro ao cadastrar produto:", err);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
      },
           

    getProductCategory: async (req, res, db) =>{
        const category_id = req.query.category;

        if(!category_id){
            return res.status(400).json({error: "Categoria invalida"})
        }
        try {
            let query = db("products").select("*")

            if(category_id){
                query = query.where("category_id", category_id)
            }    

            const products = await query
            return res.json(products)
        } catch (error) {
            return res.status(500).json({error: "Erro ao buscar produtos"})
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
