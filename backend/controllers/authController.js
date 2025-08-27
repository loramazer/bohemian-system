// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const clienteModel = require('../models/clienteModel');

// Valida o formato do e-mail
const isEmailValid = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// Função de Registro (agora corrigida)
exports.registrar = async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    // Validação no backend
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }
    if (!isEmailValid(email)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido.' });
    }

    const existingUser = await clienteModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // O objeto novoCliente é enviado para o model, que irá tratar o telefone vazio
    const novoCliente = { nome, email, telefone, senha: senhaHash };
    const clienteId = await clienteModel.create(novoCliente);

    res.status(201).json({
      message: 'Cliente registrado com sucesso!',
      clienteId: clienteId,
    });
  } catch (error) {
    // Verifica se o erro é de violação de constraint do banco de dados
    if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
      return res.status(400).json({ error: 'O formato dos dados fornecidos é inválido.' });
    }
    console.error('Erro ao registrar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Função de Login (sem alterações)
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const cliente = await clienteModel.findByEmail(email);
    if (!cliente) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const isMatch = await bcrypt.compare(senha, cliente.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const payload = { id: cliente.id_cliente, nome: cliente.nome };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido!', token: token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
