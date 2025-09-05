const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { criarCliente, buscarClientePorEmail } = require('../models/clienteModel');
const crypto = require('crypto');
const db = require('../config/db');
const nodemailer = require('nodemailer');

require('dotenv').config();

const saltRounds = 10;

// Configuração do Nodemailer com as credenciais do Ethereal
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // Ethereal não usa SSL, use 'false'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const cliente = await buscarClientePorEmail(email);
    if (!cliente) {
        return res.status(200).json({ message: 'Se as informações estiverem corretas, você receberá um e-mail com as instruções para redefinir sua senha.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora de validade

    await db.execute('INSERT INTO password_resets (fk_cliente_id, token, expires_at) VALUES (?, ?, ?)', [cliente.id_cliente, token, expiresAt]);

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: cliente.email,
        subject: 'Redefinição de Senha - Bohemian Floral',
        html: `
            <p>Olá ${cliente.nome},</p>
            <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Este link é válido por 1 hora.</p>
            <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
        `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Se as informações estiverem corretas, você receberá um e-mail com as instruções para redefinir sua senha.' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição de senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar enviar o e-mail.' });
  }
}

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()', [token]);
    const resetToken = rows[0];

    if (!resetToken) {
        return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    await db.execute('UPDATE cliente SET senha = ? WHERE id_cliente = ?', [newPasswordHash, resetToken.fk_cliente_id]);

    await db.execute('DELETE FROM password_resets WHERE id_reset = ?', [resetToken.id_reset]);

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro em resetPassword:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};