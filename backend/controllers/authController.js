const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { criarCliente, buscarClientePorEmail } = require('../models/clienteModel');
require('dotenv').config();

const saltRounds = 10; //Define o quão "complexa" será a criptografia da senha.

async function register(req, res) {
  try {
    const { nome, email, telefone, senha } = req.body;

    const clienteExistente = await buscarClientePorEmail(email);
    if (clienteExistente) return res.status(400).json({ message: 'E-mail já cadastrado' });

    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
    const id = await criarCliente(nome, email, telefone, senhaCriptografada);

    res.status(201).json({ message: 'Cliente cadastrado com sucesso', id });
  } catch (error) {
    console.error("Erro ao registrar cliente:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const cliente = await buscarClientePorEmail(email);
    if (!cliente) return res.status(401).json({ message: 'E-mail ou senha inválidos' });

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) return res.status(401).json({ message: 'E-mail ou senha inválidos' });


    const token = jwt.sign({ id: cliente.id_cliente, email: cliente.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ message: 'Login realizado com sucesso', token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

module.exports = {
  register,
  login,
};
