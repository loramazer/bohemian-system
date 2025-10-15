const db = require('../config/db');

// Manteremos as suas funções com os nomes originais em português

// Buscar todos os produtos
<<<<<<< HEAD
async function getAll(categoriaNomeCSV, searchTerm) {
let sql = `
        SELECT 
            p.id_produto, 
            p.nome, 
            p.preco_venda, 
            p.descricao, 
            p.status, 
            p.imagem_url 
        FROM produto p
    `;
    let params = [];
    let whereClauses = ["p.status = 'ativo'"]; 

    // 1. FILTRO DE CATEGORIA (MÚLTIPLO)
    if (categoriaNomeCSV) {
        // Transforma o CSV (ex: 'Novidades,Ofertas') em um array
        const categoryNames = categoriaNomeCSV.split(',');
        
        sql += `
            INNER JOIN produtocategoria pc ON p.id_produto = pc.fk_produto_id_produto
            INNER JOIN categoria c ON pc.fk_categoria_id_categoria = c.id_categoria
        `;
        
        // CRÍTICO: Cria placeholders (?) dinâmicos para a cláusula IN
        const placeholders = categoryNames.map(() => '?').join(',');
        
        whereClauses.push(`c.nome IN (${placeholders})`);
        // Adiciona cada nome da categoria individualmente aos parâmetros
        params.push(...categoryNames); 
    }

    // 2. FILTRO DE BUSCA (Mantido)
    if (searchTerm) {
        whereClauses.push(`(p.nome LIKE ? OR p.descricao LIKE ?)`);
        params.push(`%${searchTerm}%`);
        params.push(`%${searchTerm}%`);
    }

    // 3. Monta a cláusula WHERE
    if (whereClauses.length > 0) {
        sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    // CRÍTICO: Adiciona GROUP BY para evitar duplicatas ao usar JOIN com múltiplas categorias
    sql += ` GROUP BY p.id_produto ORDER BY p.id_produto DESC`;

    console.log("SQL executado:", sql); 
    console.log("Parâmetros:", params);

    const [rows] = await db.execute(sql, params);
    return rows;
=======
async function getAll() {
  const [rows] = await db.execute(`
    SELECT 
      id_produto, 
      nome, 
      preco_venda, 
      descricao, 
      ativo, 
      imagem_url 
    FROM produto
  `);
  return rows;
>>>>>>> fda0d70ea891ee4cff41b90d21b6ac3ff2f0e959
}
// Buscar produto por ID
async function getById(id) {
  // CORRIGIDO: A coluna `produto_id` foi alterada para `id_produto`
  const [rows] = await db.execute('SELECT * FROM produto WHERE id_produto = ?', [id]);
  return rows[0];
}

// Criar produto
async function create({ nome, preco_venda, descricao = null, ativo = 1, imagem_url = null }) {
  const [result] = await db.execute(
    'INSERT INTO produto (nome, preco_venda, descricao, ativo, imagem_url) VALUES (?, ?, ?, ?, ?)',
    [nome, preco_venda, descricao, ativo, imagem_url]
  );
  return { id_produto: result.insertId, nome, preco_venda, descricao, ativo, imagem_url };
}

// Atualizar produto
async function update(id, { nome, preco_venda, descricao = null, ativo = 1, imagem_url = null }) {
  await db.execute(
    'UPDATE produto SET nome = ?, preco_venda = ?, descricao = ?, ativo = ?, imagem_url = ? WHERE id_produto = ?',
    [nome, preco_venda, descricao, ativo, imagem_url, id]
  );
  return { id_produto: id, nome, preco_venda, descricao, ativo, imagem_url };
}

// Remover um produto
async function remove(id) {
  // CORRIGIDO: A coluna `produto_id` foi alterada para `id_produto`
  await db.execute('DELETE FROM produto WHERE id_produto = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };