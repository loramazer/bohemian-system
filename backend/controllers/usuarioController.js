const usuarioModel = require('../models/usuarioModel');
const enderecoModel = require('../models/enderecoModel');
const bcrypt = require('bcrypt');


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

        delete usuario.senha;

        res.status(200).json({ ...usuario, enderecos });

    } catch (error)
    {
        console.error('Erro ao buscar perfil do usuário:', error);
        res.status(500).json({ message: 'Erro interno ao buscar perfil.' });
    }
};


exports.updateMeuPerfil = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        if (!id_usuario) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const { nome, email, telefone, senhaAtual, novaSenha } = req.body;

        const usuarioAtual = await usuarioModel.findById(id_usuario);
        if (!usuarioAtual) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const dadosAtualizar = {
            nome: nome || usuarioAtual.nome,
            email: email || usuarioAtual.login, 
            telefone: telefone || usuarioAtual.telefone,
            senha: usuarioAtual.senha 
        };

        if (senhaAtual && novaSenha) {
            const senhaValida = await bcrypt.compare(senhaAtual, usuarioAtual.senha);
            if (!senhaValida) {
                return res.status(400).json({ message: 'A senha atual está incorreta.' });
            }
            const saltRounds = 10;
            dadosAtualizar.senha = await bcrypt.hash(novaSenha, saltRounds);
        }

        if (email && email !== usuarioAtual.login) {
            const emailExistente = await usuarioModel.findByEmail(email);
            if (emailExistente && emailExistente.id_usuario !== id_usuario) {
                return res.status(400).json({ message: 'Este e-mail já está em uso por outra conta.' });
            }
        }

        const usuarioAtualizado = await usuarioModel.update(id_usuario, dadosAtualizar);

        delete usuarioAtualizado.senha;

        res.status(200).json({ message: 'Perfil atualizado com sucesso!', usuario: usuarioAtualizado });

    } catch (error)
    {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar perfil.' });
    }
};