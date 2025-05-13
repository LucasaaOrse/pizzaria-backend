const express = require('express');
const { Server } = require("socket.io");
const http = require("http");
const db = require('./database'); // Importa a conexão com o banco de dados
const userRoutes = require('./routes/users/UserRoutes');
const authRoutes = require("./routes/users/AuthRouter");
const detailsRoutes = require("./routes/DetailsRouter");
const isAuth = require("./middleware/isAuth");
const categoryRoutes = require("./routes/categorys/CategoryRoutes");
const productsRoutes = require('./routes/products/ProductsRoutes');
const ordersRoutes = require("./routes/orders/ordersRoutes");
const itemsRoutes = require("./routes/orders/itemsRouter");
const ordersDetailsRouter = require('./routes/orders/ordersDetailsRouter');
const ingredientsRoutes = require('./routes/ingredients/IngredientsRoutes')
const recipesRoutes = require('./routes/recipes/RecipesRoutes')
const knex = require('./database');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express(); // 🔄 Corrigido: app criado antes
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*", // ajuste conforme necessário
  },
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
});

module.exports = { server, io };

// CORS
app.use(cors({
  origin: '*', // 🔄 Ajuste conforme necessário
  credentials: true
}));

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/users', userRoutes(db));
app.use('/login', authRoutes(db));
app.use('/userinfo', isAuth, detailsRoutes(db));
app.use('/category', isAuth, categoryRoutes(db));
app.use('/product', isAuth, productsRoutes(db));
app.use('/order', isAuth, ordersRoutes(db));
app.use('/order/add', isAuth, itemsRoutes(db));
app.use('/order/get', isAuth, itemsRoutes(db));
app.use('/order/remove', isAuth, itemsRoutes(db));
app.use('/order/details', isAuth, ordersDetailsRouter(db));
app.use('/ingredients', isAuth, ingredientsRoutes(db))
app.use('/recipes', isAuth, recipesRoutes(db))

// 🔄 Só inicia o servidor se as migrations forem executadas
knex.migrate.latest()
  .then(() => {
    console.log('✅ Migrations executadas com sucesso!');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao rodar migrations:', err);
  });
