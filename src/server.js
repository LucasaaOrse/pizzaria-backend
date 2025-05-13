// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const knex = require('./database');

// Cria app e server HTTP
const app = express();
const server = http.createServer(app);

// Configura CORS para permitir seu frontend
app.use(cors({ origin: ['*'], credentials: true }));
app.options('*', cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Importa e inicializa Socket.IO via módulo separado
const { initSocket } = require('./socket');
const io = initSocket(server);

// Rotas
const userRoutes = require('./routes/users/UserRoutes');
const authRoutes = require('./routes/users/AuthRouter');
const detailsRoutes = require('./routes/DetailsRouter');
const isAuth = require('./middleware/isAuth');
const categoryRoutes = require('./routes/categorys/CategoryRoutes');
const productsRoutes = require('./routes/products/ProductsRoutes');
const ordersRoutes = require('./routes/orders/ordersRoutes');
const itemsRoutes = require('./routes/orders/itemsRouter');
const ordersDetailsRouter = require('./routes/orders/ordersDetailsRouter');
const ingredientsRoutes = require('./routes/ingredients/IngredientsRoutes');
const recipesRoutes = require('./routes/recipes/RecipesRoutes');

app.use('/users', userRoutes(knex));
app.use('/login', authRoutes(knex));
app.use('/userinfo', isAuth, detailsRoutes(knex));
app.use('/category', isAuth, categoryRoutes(knex));
app.use('/product', isAuth, productsRoutes(knex));
app.use('/order', isAuth, ordersRoutes(knex));
app.use('/order/add', isAuth, itemsRoutes(knex));
app.use('/order/get', isAuth, itemsRoutes(knex));
app.use('/order/remove', isAuth, itemsRoutes(knex));
app.use('/order/details', isAuth, ordersDetailsRouter(knex));
app.use('/ingredients', isAuth, ingredientsRoutes(knex));
app.use('/recipes', isAuth, recipesRoutes(knex));

// Inicia o server HTTP (não app.listen)
knex.migrate.latest()
  .then(() => {
    console.log('✅ Migrations executadas com sucesso!');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ Erro ao rodar migrations:', err));