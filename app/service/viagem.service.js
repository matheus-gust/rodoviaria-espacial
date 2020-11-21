const viagemRepository = require('../db/viagem.db');
const destinoRepository = require('../db/destino.db');

async function insereViagem(viagem) {
    const destino = await destinoRepository.findById(viagem.destino);
    if (destino[0]) {
        return await viagemRepository.saveViagem(viagem);
    }
    return null;
}

async function listaViagens() {
    return await viagemRepository.findAll();
}

async function listaViagensImagens() {
    return await viagemRepository.findAllImagem();
}

async function excluirViagem(idDestino) {
    return await viagemRepository.deleteViagem(idDestino);
}

module.exports = {
    insereViagem,
    listaViagens,
    excluirViagem,
    listaViagensImagens
}