const express = require('express');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');


const app = express();
app.use(cors());
app.use(express.json());


const apiRouter = express.Router();


apiRouter.use('/auth', authRoutes);
apiRouter.use('/categorias', categoriaRoutes);
apiRouter.use('/pagamentos', pagamentoRoutes);
apiRouter.use('/produtos', produtoRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/carrinho', carrinhoRoutes);
apiRouter.use('/enderecos', enderecoRoutes);
apiRouter.use('/favoritos', favoritoRoutes);
apiRouter.use('/pedidos', pedidoRoutes);
apiRouter.use('/usuario', usuarioRoutes);


app.use('/api', apiRouter);

console.log("--- ROTAS DO DASHBOARD CARREGADAS COM SUCESSO ---");


app.get('/', (req, res) => {
    res.send('Servidor principal está rodando!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor do backend rodando na porta ${PORT}`);
  require('./config/db').query('SELECT 1')
    .then(() => console.log('MySQL conectado com sucesso!'))
    .catch(err => console.error('Falha na conexão com MySQL:', err));
});