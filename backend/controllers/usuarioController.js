// backend/controllers/usuarioController.js
const usuarioModel = require('../models/usuarioModel');
const enderecoModel = require('../models/enderecoModel');
const bcrypt = require('bcrypt');

// GET /api/usuario/me
// Busca o perfil completo (dados + endereços)
exports.getMeuPerfil = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        if (!id_usuario) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const usuario = await usuarioModel.findById(id_usuario);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const enderecos = await enderecoModel.findByUserId(id_usuario);

        // Remove a senha antes de enviar
        delete usuario.senha;

        res.status(200).json({ ...usuario, enderecos });

    } catch (error)
    {
        console.error('Erro ao buscar perfil do usuário:', error);
        res.status(500).json({ message: 'Erro interno ao buscar perfil.' });
    }
};

// PUT /api/usuario/me
// Atualiza os dados do perfil
exports.updateMeuPerfil = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        if (!id_usuario) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const { nome, email, telefone, senhaAtual, novaSenha } = req.body;

        // 1. Pega os dados atuais
        const usuarioAtual = await usuarioModel.findById(id_usuario);
        if (!usuarioAtual) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // 2. Prepara os dados para atualização
        const dadosAtualizar = {
            nome: nome || usuarioAtual.nome,
            email: email || usuarioAtual.login, // 'login' é o campo do email no DB
            telefone: telefone || usuarioAtual.telefone,
            senha: usuarioAtual.senha // Mantém a senha atual por padrão
        };

        // 3. Lógica de atualização de senha
        if (senhaAtual && novaSenha) {
            const senhaValida = await bcrypt.compare(senhaAtual, usuarioAtual.senha);
            if (!senhaValida) {
                return res.status(400).json({ message: 'A senha atual está incorreta.' });
            }
            // Criptografa a nova senha
            const saltRounds = 10;
            dadosAtualizar.senha = await bcrypt.hash(novaSenha, saltRounds);
        }

        // 4. Verifica se o email (login) já está em uso por OUTRO usuário
        if (email && email !== usuarioAtual.login) {
            const emailExistente = await usuarioModel.findByEmail(email);
            if (emailExistente && emailExistente.id_usuario !== id_usuario) {
                return res.status(400).json({ message: 'Este e-mail já está em uso por outra conta.' });
            }
        }

        // 5. Atualiza no banco
        const usuarioAtualizado = await usuarioModel.update(id_usuario, dadosAtualizar);
        
        // Remove a senha antes de retornar
        delete usuarioAtualizado.senha;

        res.status(200).json({ message: 'Perfil atualizado com sucesso!', usuario: usuarioAtualizado });

    } catch (error)
    {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar perfil.' });
    }
};