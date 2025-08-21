const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('./carrinhoRoutes', carrinhoRoutes);


// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


app.get('/', (req, res) => {
  res.send('API Bohemian está rodando!');
});
