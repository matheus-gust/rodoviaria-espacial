
const usuarioRepository = require("../db/usuario.db");
const viagemRepository = require("../db/viagem.db");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

async function buscaUsuario(email) {
    var usuario = await usuarioRepository.findByEmail(email);
    return usuario[0];
}

async function efetuaLogin(credenciais) {
    const usuario = await usuarioRepository.findByEmail(credenciais.email);
    if (usuario[0].email) {
        if (await bcrypt.compare(credenciais.senha, usuario[0].senha)) {
            return await geraToken(usuario[0].email, usuario[0].permissao);
        }
        return null;
    }
    return null;
}

async function insereUsuario(usuario) {
    const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
    usuario.senha = senhaCriptografada;
    serverResponse = await usuarioRepository.saveUsuario(usuario);
    return serverResponse;
}

async function geraToken(email, permissao) {
    const usuarioLogado = { email: email, permissao: permissao }
    const accessToken = await jwt.sign(usuarioLogado, 'trabalhowebbcctoken');
    return accessToken;
}

async function adicionarViagemAoUsuario(usuario, idviagem) {
    const usuarioLogado = await usuarioRepository.findByEmail(usuario.email);
    const viagem = await viagemRepository.findById(idviagem);
    if (usuarioLogado[0] && viagem[0]) {
        if(viagem[0].vagas > 0) {
            if (usuarioLogado[0].credito > viagem[0].valor) {
                viagemRepository.insereViagemUsuario(usuarioLogado[0].id, viagem[0].id);
                usuarioLogado[0].credito -= viagem[0].valor;
                viagem[0].vagas -= 1;
                await usuarioRepository.atualizaUsuario(usuarioLogado[0]);
                await viagemRepository.atualizaViagem(viagem[0]);
                return 0;
            } else {
                return 1;
            }
        } else {
            return 2;
        }
    }
}

async function editaUsuario(usuario) {
    return await usuarioRepository.editaUsuario(usuario);
}

module.exports = {
    insereUsuario,
    efetuaLogin,
    adicionarViagemAoUsuario,
    buscaUsuario,
    editaUsuario
}