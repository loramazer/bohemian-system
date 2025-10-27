// backend/seedAdmin.js

const bcrypt = require('bcrypt');
const db = require('./config/db');

async function createAdmin() {
    console.log('A iniciar script para criar administrador...');

    const adminData = {
        nome: 'Admin Bohemian',
        email: 'admin@bohemian.com',
        senha: 'senhaSuperSegura123',
    };
  
    let connection;
    try {
        connection = await db.getConnection();
        console.log('-> Conexão com o MySQL estabelecida.');
        
        await connection.beginTransaction();

        const [userRows] = await connection.query('SELECT * FROM usuario WHERE login = ?', [adminData.email]);
        if (userRows.length > 0) {
            console.log('-> Utilizador com este e-mail já existe. A cancelar operação.');
            await connection.rollback();
            return;
        }

        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(adminData.senha, saltRounds);

        // CORREÇÃO: Incluindo 'nome' (obrigatório) e usando 'admin' (1 para TRUE)
        const userSql = 'INSERT INTO usuario (nome, login, senha, admin) VALUES (?, ?, ?, ?)';
        const [userResult] = await connection.query(userSql, [adminData.nome, adminData.email, senhaHash, 1]);
        const novoUsuarioId = userResult.insertId;
        console.log(`-> Registo criado na tabela 'usuario' com ID: ${novoUsuarioId} e permissão ADMIN (1).`);
        
        // A lógica de inserção na tabela 'colaborador' FOI REMOVIDA.

        await connection.commit();
        console.log(`\n✅ Administrador "${adminData.nome}" criado com sucesso!`);

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('❌ Ocorreu um erro ao criar o administrador:', error);
    } finally {
        if (connection) connection.release();
        console.log('-> Conexão com o MySQL libertada. Script finalizado.');
        process.exit();
    }
}

createAdmin();