

module.exports = {
    detailUser: async (req, res, db) => {
        const user_id = req.user_id
        const user = await db("users").where({ id: user_id }).select("id","name", "email")
        return res.json(user)
    }
}
