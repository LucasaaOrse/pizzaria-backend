

module.exports = {
    createCategory: async (req, res, db) =>{
        const { name } = req.body

        if(name === ''){
            return res.status(400).json({error: "Categoria invalida"})
        }

        try {
            const categoryAlreadyExist = await db("categories").where({ name}).first()
            if(categoryAlreadyExist){
                return res.status(400).json({mensage: "Essa categoria ja esta cadastrada"})
            }

            await db('categories').insert({ name})
            res.status(201).json({mensage: "Categoria cadastrada com sucesso"})

        } catch (error) {
            return res.status(500).json({error: "Erro ao salvar Categoria"})
        }
    },

    getAllCategorys: async (req, res, db) =>{
        

        try {
        
            const categories = await db("categories").select("id", "name")
            res.status(200).json(categories)

        } catch (error) {
            res.status(500).json({error: "Erro ao listar as categorias"})
        }


    },

    deleteCategory: async (req, res, db) =>{
        const { id } = req.body

        if(!id){
            return res.status(404).json({error: "Categoria invalida"})
        }

        try {

            const deleted = await db("categories").where({ id }).del();

            if (deleted === 0) {
                return res.status(404).json({ error: "Categoria não encontrada" });
            }
            
            await db("categories").where({id}).del()

            return res.status(200).json({mensage: "Categoria deletada com sucesso"})

        } catch (error) {
            res.status(500).json({error: "Erro ao deletar categoria"})
        }
    }
};