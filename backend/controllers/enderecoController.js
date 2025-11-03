const Endereco = require('../models/enderecoModel');
const Cidade = require('../models/cidadeModel');


exports.createEndereco = async (req, res) => {
    try {
        const id_usuario = req.user.id; 
        if (!id_usuario) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
 
        const { rua, numero, bairro, cidade, estado } = req.body;
        const complemento = req.body.complemento || null;

        const cepLimpo = req.body.cep ? req.body.cep.replace(/\D/g, '') : null;

        if (!cepLimpo || cepLimpo.length !== 8) {
            return res.status(400).json({ message: "Formato de CEP inválido. Deve conter 8 números." });
        }
        
        const id_cidade = await Cidade.findOrCreate(cidade, estado);

        const dadosEndereco = {
            rua,
            numero,
            complemento,
            bairro,
            cep: cepLimpo, 
            id_cidade 
        };

        const novoEndereco = await Endereco.create(id_usuario, dadosEndereco);
        res.status(201).json(novoEndereco);

    } catch (error) {
        console.error("Erro ao criar endereço:", error); 
        res.status(500).json({ message: "Erro ao salvar endereço." });
    }
};


exports.getEnderecosUsuario = async (req, res) => {
    try {
        const id_usuario = req.user.id; 

        if (!id_usuario) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        
        const enderecos = await Endereco.findByUserId(id_usuario);
        res.status(200).json(enderecos);

    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        res.status(500).json({ message: "Erro ao buscar endereços." });
    }
};

exports.deleteEndereco = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        const { id } = req.params; 

        if (!id_usuario) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }

        const affectedRows = await Endereco.remove(id, id_usuario);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Endereço não encontrado ou não pertence a este usuário." });
        }
        
        const enderecos = await Endereco.findByUserId(id_usuario);
        res.status(200).json({ message: "Endereço removido com sucesso.", enderecos });

    } catch (error) {
        console.error("Erro ao deletar endereço:", error);
        res.status(500).json({ message: "Erro ao deletar endereço." });
    }
};