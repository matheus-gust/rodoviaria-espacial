const db = require('./db.js');


async function findAllByUsuario(email) {
    const conn = await db.connectar();
    const sql = 'SELECT c.descricao, c.valor, d.nome FROM (select * from rodoviaria.usuario where email=?) as A ' +
                'INNER JOIN rodoviaria.viagem_usuario as B on a.id = b.id_usuario '  +
                'INNER JOIN (select * from rodoviaria.viagem) as C on b.id_viagem = c.id ' +
                'INNER JOIN (select * from rodoviaria.destino) as D on c.id_destino = d.id;';
    const [value] = [email];
    const [compras] = await conn.query(sql,value)
    return compras;
}

/*async function findAllByUsuario(email) {
    const conn = await db.connectar();
    const sql = 'SELECT a.*, b.permissao FROM rodoviaria.usuario as A INNER JOIN rodoviaria.permissoes as B on a.permissao = b.idpermissoes WHERE a.email = ?';
    const [value] = [email];
    const [usuario] = await conn.query(sql,value)
    return usuario;
}*/

module.exports = {
    findAllByUsuario
};