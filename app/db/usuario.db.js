const db = require('./db.js');

async function findByEmail(email) {
    const conn = await db.connectar();
    const sql = 'SELECT a.*, b.permissao FROM rodoviaria.usuario as A INNER JOIN rodoviaria.permissoes as B on a.permissao = b.idpermissoes WHERE a.email = ?';
    const [value] = [email];
    const [usuario] = await conn.query(sql,value)
    return usuario;
}

async function findById(id) {
    const conn = await db.connectar();
    const sql = 'SELECT * FROM usuario WHERE id=?';
    const value = [id];
    return await conn.query(sql,value);
}

async function saveUsuario(usuario) {
    const conn = await db.connectar();
    const sql = 'INSERT INTO usuario(nome,senha,email,cpf, permissao, credito) VALUES(?,?,?,?,?,?);';
    const values = [usuario.nome,usuario.senha,usuario.email,usuario.cpf, 2, 500];
    return  await conn.query(sql, values);
}

async function atualizaUsuario(usuario) {
    console.log(usuario)
    const conn = await db.connectar();
    const sql = 'UPDATE usuario SET nome=?, senha=?, email=?, cpf=?, credito=? WHERE id=?;';
    const values = [usuario.nome,usuario.senha,usuario.email,usuario.cpf, usuario.credito, usuario.id];
    return await conn.query(sql, values);
}

async function editaUsuario(usuario) {
    console.log(usuario.nome + ' ' + usuario.id)
    const conn = await db.connectar();
    const sql = 'UPDATE usuario SET nome=?, email=?, cpf=?, imagem=? WHERE id=?';
    const values = [usuario.nome, usuario.email, usuario.cpf, usuario.imagem, usuario.id];
    const rows = await conn.query(sql, values);
    return [rows];
}


module.exports = {
    findByEmail,
    findById,
    saveUsuario,
    atualizaUsuario,
    editaUsuario
}