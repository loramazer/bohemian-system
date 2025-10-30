const Endereco = require('../models/enderecoModel');
const Cidade = require('../models/cidadeModel');


exports.createEndereco = async (req, res) => {
    try {
        const id_usuario = req.user.id; 
        if (!id_usuario) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
 
        // 1. Recebe os dados do frontend
        const { rua, numero, bairro, cidade, estado } = req.body;
        const complemento = req.body.complemento || null;

        // --- AQUI ESTÁ A CORREÇÃO ---
        // O req.body.cep vem com máscara (ex: "12345-678")
        // O banco (VARCHAR(8)) espera apenas os 8 números.
        // Vamos limpar todos os caracteres que não são dígitos (\D)
        const cepLimpo = req.body.cep ? req.body.cep.replace(/\D/g, '') : null;

        // Validação extra para garantir que o CEP está correto após a limpeza
        if (!cepLimpo || cepLimpo.length !== 8) {
            return res.status(400).json({ message: "Formato de CEP inválido. Deve conter 8 números." });
        }
        
        // 3. Encontra ou cria o ID da cidade
        const id_cidade = await Cidade.findOrCreate(cidade, estado);

        // 4. Monta o objeto de dados com o CEP limpo
        const dadosEndereco = {
            rua,
            numero,
            complemento,
            bairro,
            cep: cepLimpo, // <-- Usando o CEP limpo (apenas números)
            id_cidade 
        };

        // 5. Salva o endereço
        const novoEndereco = await Endereco.create(id_usuario, dadosEndereco);
        res.status(201).json(novoEndereco);

    } catch (error) {
        console.error("Erro ao criar endereço:", error); 
        // Se o erro for do MySQL (como o ER_DATA_TOO_LONG), este log o mostrará
        res.status(500).json({ message: "Erro ao salvar endereço." });
    }
};

// ... (Sua função getEnderecosUsuario) ...
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