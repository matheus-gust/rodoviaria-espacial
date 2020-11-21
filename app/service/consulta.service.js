const consultaRepository = require('../db/consulta.db');

async function consultaCompra(usuario) {
    return await consultaRepository.findAllByUsuario(usuario.email);
}

module.exports = {
    consultaCompra
};