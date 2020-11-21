const destinoRepository = require('../db/destino.db');

async function listaDestinos() {
    return await destinoRepository.findAll();
}

async function insereDestino(destino) {
    return await destinoRepository.saveDestino(destino);
}

async function editaDestino(destino) {
    return await destinoRepository.editaDestino(destino);
}

async function excluirDestino(idDestino) {
    return await destinoRepository.deleteDestino(idDestino);
}

async function buscarDestino(id) {
    return await destinoRepository.findDestinoById(id);
}

module.exports = {
    listaDestinos,
    insereDestino,
    excluirDestino,
    buscarDestino,
    editaDestino
}