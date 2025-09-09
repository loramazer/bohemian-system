const express = require('express');
const cors = require('cors');
const path = require('path'); // Importe o módulo 'path'
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Adicione esta linha para servir arquivos estáticos da pasta 'public' do front-end
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


app.get('/', (req, res) => {
  res.send('API Bohemian está rodando!');
});

app.use('/public', express.static('public'));