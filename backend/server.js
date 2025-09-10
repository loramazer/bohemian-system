const express = require('express');
const cors = require('cors');
const path = require('path'); // Importe o módulo 'path'
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // Importe a nova rota

const app = express();
app.use(cors());
app.use(express.json());

// Adicione esta linha para servir arquivos estáticos da pasta 'public' do front-end
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/auth', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/dashboard', dashboardRoutes); // Adicione a nova rota para o dashboard
app.use('/carrinho', carrinhoRoutes);

// Rota inicial (teste rápido no navegador)
app.get('/', (req, res) => {
  res.send('API Bohemian está rodando!');
});

app.use('/public', express.static('public'));
