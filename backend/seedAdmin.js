const bcrypt = require('bcrypt');
const db = require('./config/db');

async function createAdmin() {
    console.log('A iniciar script para criar administrador...');
    
    // --- CONFIGURE SEU ADMIN AQUI ---
    const adminData = {
        nome: 'Admin Bohemian',
        email: 'admin@bohemian.com',
        senha: 'senhaSuperSegura123',
    };
    // ---------------------------------

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

        const userSql = 'INSERT INTO usuario (login, senha, role) VALUES (?, ?, ?)';
        const [userResult] = await connection.query(userSql, [adminData.email, senhaHash, 'admin']);
        const novoUsuarioId = userResult.insertId;
        console.log(`-> Registo criado na tabela 'usuario' com ID: ${novoUsuarioId}`);

        const colabSql = 'INSERT INTO colaborador (nome, fk_id_usuario) VALUES (?, ?)';
        const [colabResult] = await connection.query(colabSql, [adminData.nome, novoUsuarioId]);
        console.log(`-> Perfil criado na tabela 'colaborador' com ID: ${colabResult.insertId}`);

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