const db = require('./db.js');

async function findAll() {
    const conn = await db.connectar();
    const sql = 'SELECT id, nome, descricao FROM destino';
    var [rows] = await conn.query(sql)
    return rows;
}

async function findById(id) {
    const conn = await db.connectar();
    const sql = 'SELECT * FROM destino WHERE id=?';
    const values = [id];
    const [rows] = await conn.query(sql, values);
    return rows;
}

async function deleteDestino(id) {
    const conn = await db.connectar();
    const sql = 'DELETE FROM destino WHERE id=?';
    const values = [id];
    console.log(values)
    await conn.query(sql, values);
}

async function saveDestino(destino) {
    const conn = await db.connectar();
    const sql = 'INSERT INTO destino(nome,descricao,imagem) VALUES(?,?,?);';
    const values = [destino.nome, destino.descricao, destino.imagem];
    return await conn.query(sql, values);
}

async function findDestinoById(id) {
    const conn = await db.connectar();
    const sql = 'SELECT * FROM destino WHERE id=?';
    const values = [id];
    const [rows] = await conn.query(sql, values);
    return rows[0];
}

async function editaDestino(destino) {
    const conn = await db.connectar();
    const sql = 'UPDATE destino SET nome=?, descricao=?, imagem=? WHERE id=?';
    const values = [destino.nome, destino.descricao, destino.imagem, destino.id];
    return await conn.query(sql, values);
}

module.exports = {
    findAll,
    saveDestino,
    findById,
    deleteDestino,
    findDestinoById,
    editaDestino
}