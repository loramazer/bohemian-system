const db = require('../config/db');


async function getAll(options) {
    const {
        categories, 
        search,
        sort,
        maxPrice,
        page = 1,
        limit = 9
    } = options;

    let params = [];
    let whereClauses = ["p.ativo = 1"];
    let sql = `
        SELECT 
            p.id_produto, 
            p.nome, 
            p.preco_venda, 
            p.descricao, 
            p.ativo, 
            p.imagem_url 
        FROM produto p
    `;
    
    let countParams = [];
    let countSql = `SELECT COUNT(DISTINCT p.id_produto) as totalProducts FROM produto p`;

    const categoryIds = (categories || '')
                                  .split(',')
                                  .map(id => parseInt(id.trim()))
                                  .filter(id => !isNaN(id) && id > 0);

    if (categoryIds.length > 0) {
        const joinSql = `
            INNER JOIN produtocategoria pc ON p.id_produto = pc.fk_produto_id_produto
            INNER JOIN categoria c ON pc.fk_categoria_id_categoria = c.id_categoria
        `;
        sql += joinSql;
        countSql += joinSql;
        
        const placeholders = categoryIds.map(() => '?').join(',');
        whereClauses.push(`c.id_categoria IN (${placeholders})`);
        params.push(...categoryIds);
        countParams.push(...categoryIds);
    }

    if (search) {
        whereClauses.push(`(p.nome LIKE ? OR p.descricao LIKE ?)`);
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
        countParams.push(searchParam, searchParam);
    }

if (maxPrice !== undefined && maxPrice !== null && !isNaN(maxPrice)) {
    whereClauses.push(`p.preco_venda <= ?`);
    params.push(Number(maxPrice));
    countParams.push(Number(maxPrice));
}


    if (whereClauses.length > 0) {
        const whereString = ` WHERE ` + whereClauses.join(' AND ');
        sql += whereString;
        countSql += whereString;
    }


    const [countResult] = await db.execute(countSql, countParams);
    const totalProducts = countResult[0].totalProducts;
    const totalPages = Math.ceil(totalProducts / limit);

    sql += ` GROUP BY p.id_produto`;
    
    let orderBy = ' ORDER BY p.nome ASC'; 
    switch (sort) {
        case 'name_desc':
            orderBy = ' ORDER BY p.nome DESC';
            break;
        case 'price_asc':
            orderBy = ' ORDER BY p.preco_venda ASC';
            break;
        case 'price_desc':
            orderBy = ' ORDER BY p.preco_venda DESC';
            break;
    }
    sql += orderBy;

const offset = (page - 1) * limit;
const safeLimit = parseInt(limit, 10);
const safeOffset = parseInt(offset, 10);

sql += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;

console.log('SQL executado:\n', sql);
console.log('Parâmetros enviados:', params);

const [productRows] = await db.execute(sql, params);


return {
    products: productRows,
    pages: totalPages,
    totalProducts: totalProducts
};
}

async function getById(id) {
  const [rows] = await db.execute('SELECT * FROM produto WHERE id_produto = ?', [id]);
  return rows[0];
}

async function create({ nome, preco_venda, descricao = null, ativo = 1, imagem_url = null }) {
  const [result] = await db.execute(
  	'INSERT INTO produto (nome, preco_venda, descricao, ativo, imagem_url) VALUES (?, ?, ?, ?, ?)',
  	[nome, preco_venda, descricao, ativo, imagem_url]
  );
  return { id_produto: result.insertId, nome, preco_venda, descricao, ativo, imagem_url };
}

async function update(id, { nome, preco_venda, descricao = null, ativo = 1, imagem_url = null }) {
  await db.execute(
  	'UPDATE produto SET nome = ?, preco_venda = ?, descricao = ?, ativo = ?, imagem_url = ? WHERE id_produto = ?',
  	[nome, preco_venda, descricao, ativo, imagem_url, id]
  );
  return { id_produto: id, nome, preco_venda, descricao, ativo, imagem_url };
}

async function remove(id) {
    await db.execute(
    'UPDATE produto SET ativo = 0 WHERE id_produto = ?', 
    [id]
  );
}

async function getCategoryIdByName(categoryName) {
    const [rows] = await db.execute('SELECT id_categoria FROM categoria WHERE nome = ?', [categoryName]);
    return rows.length > 0 ? rows[0].id_categoria : null;
}

async function addCategoryToProduct(productId, categoryName) {
    const categoryId = await getCategoryIdByName(categoryName);
    
    if (categoryId) {
        const sql = `
            INSERT INTO produtocategoria (fk_produto_id_produto, fk_categoria_id_categoria)
            VALUES (?, ?)
        `;
        console.log('SQL:', sql);
        console.log('Params:', [productId, categoryId]);

        await db.execute(sql, [productId, categoryId]);
        return true;
    }
    
    console.warn(`Categoria "${categoryName}" não encontrada. Associação não criada.`);
    return false;
}

async function updateProductCategory(productId, categoryName) {
    const categoryId = await getCategoryIdByName(categoryName);
    
    if (!categoryId) {
        console.warn(`Categoria "${categoryName}" não encontrada para atualização.`);
        return false;
    }
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.execute('DELETE FROM produtocategoria WHERE fk_produto_id_produto = ?', [productId]);
        
        await connection.execute(
            'INSERT INTO produtocategoria (fk_produto_id_produto, fk_categoria_id_categoria) VALUES (?, ?)',
            [productId, categoryId]
        );
        
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        console.error("Erro ao atualizar categoria do produto:", error);
        throw error; 
    } finally {
        connection.release();
    }
}


module.exports = { 
    getAll, 
    getById, 
    create, 
    update, 
    remove, 
    addCategoryToProduct,
    updateProductCategory 
};