const db = require('./db.js');

async function saveViagem(viagem) {
    const conn = await db.connectar();
    const sql = 'INSERT INTO viagem(descricao,valor,vagas,id_destino) VALUES(?,?,?,?);';
    const values = [viagem.descricao, viagem.valor, viagem.vagas, viagem.destino];
    const response = await conn.query(sql, values);
    return response;
}

async function findAll() {
    const conn = await db.connectar();
    const sql = 'SELECT a.id, a.descricao, a.valor, a.vagas, b.nome as destino FROM viagem as A INNER JOIN destino as B on a.id_destino = b.id;';
    var [rows] = await conn.query(sql)
    return rows;
}

async function findAllImagem() {
    const conn = await db.connectar();
    const sql = 'SELECT a.id, a.descricao, a.valor, a.vagas, b.nome as destino, b.imagem FROM viagem as A INNER JOIN destino as B on a.id_destino = b.id;';
    var [rows] = await conn.query(sql)
    return rows;
}

async function deleteViagem(id) {
    const conn = await db.connectar();
    const sql = 'DELETE FROM viagem WHERE id=?';
    const values = [id];
    console.log(values)
    await conn.query(sql, values);
}

async function findById(id) {
    const conn = await db.connectar();
    const sql = 'SELECT * FROM viagem WHERE id=?';
    const value = [id];
    const [rows] = await conn.query(sql,value)
    return rows;
}

async function insereViagemUsuario(idusuario, idviagem) {
    const conn = await db.connectar();
    const sql = 'INSERT INTO viagem_usuario(id_usuario, id_viagem) VALUES(?,?)';
    const values = [idusuario, idviagem];
    await conn.query(sql, values);
}

async function atualizaViagem(viagem) {
    console.log(viagem)
    const conn = await db.connectar();
    const sql = 'UPDATE viagem SET descricao=?, valor=?, vagas=?, id_destino=?, data_viagem=? WHERE id=?;';
    const values = [viagem.descricao, viagem.valor, viagem.vagas, viagem.id_destino, '', viagem.id];
    const response = await conn.query(sql, values);
    return response;
}

module.exports = {
    saveViagem,
    findAll,
    deleteViagem,
    insereViagemUsuario,
    findById,
    atualizaViagem,
    findAllImagem
}