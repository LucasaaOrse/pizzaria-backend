const express = require('express');
const db = require('./database'); // Importa a conexão com o banco de dados
const userRoutes = require('./routes/users/UserRoutes');
const authRoutes = require("./routes/users/AuthRouter")
const detailsRoutes = require("./routes/DetailsRouter")
const isAuth = require("./middleware/isAuth")
const categoryRoutes = require("./routes/categorys/CategoryRoutes")
const productsRoutes = require('./routes/products/ProductsRoutes')
const ordersRoutes = require("./routes/orders/ordersRoutes")
const itemsRoutes = require("./routes/orders/itemsRouter")
const ordersDetailsRouter = require('./routes/orders/ordersDetailsRouter')

const fileUpload = require('express-fileupload')




const app = express();
const PORT = 3000;

const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:3001', // ou onde o frontend estiver
  credentials: true
}))

app.use(fileUpload())


app.use(express.json()); // Permite o uso de JSON no body das requisições
app.use('/users', userRoutes(db)); // Assegura que todas as rotas de usuários estão sendo carregada0s
app.use(express.urlencoded({ extended: true })); // Para form-data
app.use('/login', authRoutes(db) )
app.use('/userinfo', isAuth , detailsRoutes(db))
app.use('/category', isAuth, categoryRoutes(db))
app.use('/product', isAuth, productsRoutes(db))
app.use('/order', isAuth, ordersRoutes(db))
app.use('/order/add', isAuth, itemsRoutes(db))
app.use('/order/get', isAuth, itemsRoutes(db))
app.use('/order/remove', isAuth, itemsRoutes(db))
app.use('/order/details', isAuth, ordersDetailsRouter(db))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
