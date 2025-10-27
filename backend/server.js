// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Importe todas as suas rotas
const authRoutes = require('./routes/authRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');



const app = express();
app.use(cors());
app.use(express.json());

// 2. Crie um roteador principal para agrupar todas as rotas da API
const apiRouter = express.Router();


// 3. Use o roteador principal para definir suas rotas
apiRouter.use('/auth', authRoutes);
apiRouter.use('/categorias', categoriaRoutes);
//apiRouter.use('/pagamento', pagamentoRoutes);
apiRouter.use('/pagamentos', pagamentoRoutes);
apiRouter.use('/produtos', produtoRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/carrinho', carrinhoRoutes);
apiRouter.use('/enderecos', enderecoRoutes);
apiRouter.use('/favoritos', favoritoRoutes);


// 4. Use o prefixo /api para o roteador principal
app.use('/api', apiRouter);


// Rota inicial de teste
app.get('/', (req, res) => {
    res.send('Servidor principal está rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor do backend rodando na porta ${PORT}`);
});