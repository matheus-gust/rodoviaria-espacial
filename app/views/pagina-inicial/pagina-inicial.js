var viagensCarregadas = [];
var compraSelecionada;
var comprador;

async function popularGrid(viagens) {
    var grid = document.querySelector('#grid')
    grid.innerHTML = []
    viagensCarregadas = viagens;
    var contador = 0;
    await viagens.forEach(viagem => {
        grid.innerHTML +=
            `<div class="col-12 col-md-4">` +
            `<div id="${contador}" onclick="selecionarViagem(this.id)" class="cartao-viagem">` +
            `<div class="campo-imagem">` +
            `<img class="imagem-planeta" src="${viagem.imagem}">` +
            `<div class="ingressar">` +
            ((viagem.vagas > 0) ? 'Ingressar' : '<span style="color: rgb(225,0,0)">Não é possivel ingressar</span>') +
            '</div>' +
            '</div>' +
            `<div class="descricao-viagem">` +
            viagem.destino +
            '</div>' +
            `<div class="especificacao-viagem">` +
            'Vagas: ' + viagem.vagas +
            '</div>' +
            `<div class="especificacao-viagem">` +
            'Preço: R$' + viagem.valor +
            '</div>' +
            '</div>' +
            '</div>';
        contador++;
    });
}

function selecionarViagem(numero) {
    var sidebar = document.querySelector('#sidebar');
    var viagem = viagensCarregadas[numero];
    sidebar.innerHTML = [];
    sidebar.innerHTML =
        '<button onclick="limparSelecao()" style="margin-top: 50px; border: none; outline: none; color: white; background-color: transparent;"><i class="fa fa-times"></i></button>' +
        '<div class="container">' +
        '<div class="row">' +
        '<div style="color: #ffffff; font-size: 18pt;" class="col-12 text-center">' +
        'Viagem Selecionada' +
        '</div>' +
        '<img style="box-shadow: 0 1px 16px 0 rgba(0, 0, 0, 0.2),0 6px 20px 0 rgba(0, 0, 0, 0.2);"' +
        `class="imagem-selecionada mt-3" src="${viagem.imagem}">` +
        '</div>' +
        '<div class="row">' +
        '<div style="color: #ffffff;" class="col-12 descricao-viagem text-center">' +
        viagem.destino +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div style="color: #ffffff; text-align: justify;" class="col-12 mt-3">' +
        viagem.descricao +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div style="color: #ffffff; margin: 0;" class="col-12 mt-3 especificacao-viagem">' +
        'Vagas: ' + viagem.vagas +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div style="color: #ffffff; margin: 0;" class="col-12 mt-3 especificacao-viagem">' +
        'Data: ' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
        '<div style="color: #ffffff; margin: 0;" class="col-12 mt-3 especificacao-viagem">' +
        'Preço: R$' + viagem.valor +
        '</div>' +
        '</div>' +
        '</div>' +
        `<button onclick="abrirDialogDetalhesCompra(${numero})" style="color: white; background-color: rgb(0, 201, 33); width: 100%; height: 50px; margin-top: 15px; position: absolute; bottom: 0" class="btn">` +
        'Confirmar Ingresso' +
        '</button>';
}

function limparSelecao() {
    var sidebar = document.querySelector('#sidebar');
    sidebar.innerHTML = [];
}

var viagemRequest = async () => {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    return await fetch('/pagina-inicial/listar-viagens-imagens', {
        method: 'GET',
        headers: headers
    });
}

function listarViagens() {
    viagemRequest().then(
        async (response) => {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            var viagens = await response.json();
            popularGrid(viagens)
        }
    );
}

async function confirmarIngresso(idviagem) {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    await fetch('/pagina-inicial/ingressar/' + idviagem, {
        method: 'post',
        headers: headers
    }).then(
        (response) => {
            listarViagens();
            limparSelecao();
            var planoCompra = document.querySelector('#plano-compra');
            planoCompra.classList = ['naovisivel'];
            abrirToasty('Ingresso realizado com Sucesso');
        }
    );
}

async function buscarComprador() {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    return await fetch('/pagina-inicial/usuario', {
        method: 'GET',
        headers: headers
    }).then(
        async (response) => {
            var usuario = await response.json();
            comprador = usuario;
        }
    );
}

async function abrirDialogDetalhesCompra(numero) {
    btnConfirmarCompra.disabled = false;
    mensagemSaldo.hidden = true;
    mensagemVagas.hidden = true;
    await buscarComprador();
    var planoCompra = document.querySelector('#plano-compra');
    planoCompra.classList = ['plano-ascendente']
    compraSelecionada = this.viagensCarregadas[numero];
    valor.innerHTML = 'Valor: R$' + compraSelecionada.valor;
    compradorLabel.innerHTML = 'Comprador: ' + comprador.nome;
    vagas.innerHTML = 'Vagas: ' + compraSelecionada.vagas;
    saldo.innerHTML = 'Saldo: R$' + comprador.credito;
    tituloConfirmarCompra.innerHTML = 'Confirmar compra viagem à ' + compraSelecionada.destino;
    if (compraSelecionada.valor > comprador.credito) {
        btnConfirmarCompra.disabled = true;
        mensagemSaldo.hidden = false;
    }
    if (compraSelecionada.vagas < 1) {
        btnConfirmarCompra.disabled = true;
        mensagemVagas.hidden = false;
    }
}

function fecharDialog() {
    var planoCompra = document.querySelector('#plano-compra');
    planoCompra.classList = ['naovisivel'];
}

function abrirToasty(mensagem) {
    var mensagemToasty = document.querySelector('#mensagem-toasty');
    toasty.classList = ['toasty'];
    mensagemToasty.innerHTML = [];
    mensagemToasty.innerHTML = mensagem;
    setTimeout(
        () => {
            mensagemToasty.innerHTML = [];
            toasty.classList = ['naovisivel'];
        }, 5000
    )
}

function abrirPaginaUsuario() {
    location.href = 'http://127.0.0.1:3000/usuario';
}

function logout() {
    localStorage.clear('token')
    location.href = "http://127.0.0.1:3000/login";
}

function paginaInicial() {
    location.href = "http://127.0.0.1:3000/pagina-inicial";
}

function paginaAdmin() {
    location.href = "http://127.0.0.1:3000/admin";
}

function abrirPaginaHistorico() {
    location.href = "http://127.0.0.1:3000/consulta";
}

async function verificarAdmin() {
    var token = localStorage.getItem('token');
    var usuario = await parseJwt(token);
    console.log(usuario)
    if (usuario.permissao === 'RULE_REST_ADMIN') {
        navbar.innerHTML += '<i onclick="paginaAdmin()" style="color: #ffffff; margin-right: 15px; cursor: pointer;" class="fa fa-crown fa-3x"></i>'
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


listarViagens();
verificarAdmin();