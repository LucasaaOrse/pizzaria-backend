// server.js (início do arquivo)

const express = require('express');
const http = require('http');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const knex = require('./database');

// Cria app e server HTTP
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:8081',  // Expo / React Native local
  'https://pizzaria-frontend-rho.vercel.app',            // seu front anterior
  'https://pizzaria-frontend-j4ynd0rb9-lucasaaorses-projects.vercel.app',  // seu novo domínio
  'https://pizzaria-frontend-2plr69jy7-lucasaaorses-projects.vercel.app'   // inclua este também!
];

app.use(cors({
  origin: (origin, callback) => {
    // Se não houver origin (ex: Postman, mobile nativo), permita
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      // Reflita o Origin de volta como Access-Control-Allow-Origin
      return callback(null, true);
    }
    // Caso contrário, bloqueie
    return callback(new Error('Não permitido pelo CORS'), false);
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // headers que você usa
  credentials: true
}));

// Habilita preflight para todas as rotas
app.options('*', cors());

// 2️⃣ Body parser
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
const stockRoutes = require('./routes/stock/stockRoutes');
const recipesRoutes = require('./routes/recipes/RecipesRoutes');
const messagensRoutes = require('./routes/orders/messagensRoutes')
const typesRoutes = require('./routes/types/typesRoutes')


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
app.use('/stock', isAuth, stockRoutes(knex));
app.use('/recipes', isAuth, recipesRoutes(knex));
app.use('/messages', isAuth, messagensRoutes(knex) )
app.use('/stock', isAuth, typesRoutes(knex))

// Inicia o server HTTP (não app.listen)
knex.migrate.latest()
  .then(() => {
    console.log('✅ Migrations executadas com sucesso!');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ Erro ao rodar migrations:', err));