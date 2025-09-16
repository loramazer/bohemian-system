// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const clienteModel = require('../models/clienteModel');
const colaboradorModel = require('../models/colaboradorModel');

require('dotenv').config();
const saltRounds = 10;

// Função de Login SIMPLIFICADA
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const usuario = await usuarioModel.findByEmail(email);
        if (!usuario) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }

        let perfilNome = '';
        if (usuario.role === 'admin') {
            const colaborador = await colaboradorModel.findDetailsByUsuarioId(usuario.id_usuario);
            perfilNome = colaborador ? colaborador.nome : 'Admin';
        } else {
            const cliente = await clienteModel.findDetailsByUsuarioId(usuario.id_usuario);
            perfilNome = cliente ? cliente.nome : 'Cliente';
        }

        const token = jwt.sign(
            { 
                id: usuario.id_usuario,
                email: usuario.login,
                nome: perfilNome,
                role: usuario.role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({ message: 'Login realizado com sucesso', token });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// Função de Registro ATUALIZADA
async function register(req, res) {
    try {
        const { nome, email, telefone, senha } = req.body;

        const usuarioExistente = await usuarioModel.findByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
        const novoUsuarioId = await usuarioModel.create({
            email: email,
            senha: senhaCriptografada,
            role: 'cliente'
        });

        const idCliente = await clienteModel.criarCliente({
            nome: nome,
            email: email,
            telefone: telefone,
            fk_id_usuario: novoUsuarioId
        });

        res.status(201).json({ message: 'Cliente cadastrado com sucesso', id: idCliente });
    } catch (error) {
        console.error("Erro ao registrar cliente:", error);
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
    const expiresAt = new Date(Date.now() + 3600000);

    await db.execute('INSERT INTO password_resets (fk_cliente_id, token, expires_at) VALUES (?, ?, ?)', [cliente.id_cliente, token, expiresAt]);

    const resetUrl = `${process.env.FRONTEND_URL}reset-password/${token}`;

   const mailOptions = {
  from: process.env.EMAIL_USER,
  to: cliente.email,
  subject: 'Redefinição de Senha - Bohemian Floral',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <table width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <img src="cid:bohemianLogo" alt="Bohemian Home" style="width: 150px; margin-bottom: 20px;">
                  <h1 style="color: #333333;">Redefina Sua Senha</h1>
                  <p style="color: #555555;">Olá, ${cliente.nome}.</p>
                  <a href="${resetUrl}" style="background-color: #5d7a7b; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Senha</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `,
  attachments: [
    {
      filename: 'bohemian-logo.png',
      path: __dirname + '/../public/bohemian-logo.png',
      cid: 'bohemianLogo'
    }
  ]
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