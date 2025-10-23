const Endereco = require('../models/Endereco');

exports.listarEnderecos = async (req, res) => {
    try {
        const enderecos = await Endereco.findByUserId(req.user.id_usuario);
        res.status(200).json(enderecos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar endereços.' });
    }
};

exports.adicionarEndereco = async (req, res) => {
    try {
        const novoEndereco = await Endereco.create(req.user.id_usuario, req.body);
        res.status(201).json(novoEndereco);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar endereço.' });
    }
};