var formAdicionarViagem = document.querySelector('#form-adicionar-viagem');
var planoAdicionarViagem = document.querySelector('#plano-adicionar-viagem');
var suporteTabelaViagem = document.querySelector('#suporte-tabela-viagem');
var toasty = document.querySelector('#toasty');
var mensagemToasty = document.querySelector('#mensagem-toasty');
var planoRemover = document.querySelector('#plano-remover');

function abrirDialogAdicionarViagem() {
    planoAdicionarViagem.classList = ['plano-ascendente'];
}

async function adicionarViagem() {
    if (formAdicionarViagem.checkValidity() == false) {
        formAdicionarViagem.classList.add('was-validated');
        return;
    }
    var destino = document.querySelector('#destinoViagem').value;
    var descricao = document.querySelector('#descricaoViagem').value;
    var valor = document.querySelector('#valorViagem').value;
    var vagas = document.querySelector('#vagasViagem').value;
    var viajem = { destino: destino, descricao: descricao, valor: valor, vagas: vagas };
    console.log(viajem)
    await fetch('/admin/viagens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json ',
            'Accept': 'application/json',
            'token': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(viajem)
    }).then(
        async function (response) {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            this.fecharDialog();
            await this.listarViagens();
            document.querySelector('#destinoViagem').value = null;
            document.querySelector('#descricaoViagem').value = null;
            document.querySelector('#valorViagem').value = null;
            document.querySelector('#vagasViagem').value = null;
        }
    )
}

var viagemRequest = async () => {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    return await fetch('/admin/viagens/listar', {
        method: 'GET',
        headers:headers
    });
}


function listarViagens() {
    viagemRequest().then(
        async (response) => {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            var viagens = await response.json();
            popularTabela(viagens)
        }
    );
}

async function popularTabela(viagens) {
    var viagensTabela = document.querySelector('#corpo-tabela-viagem');
    viagensTabela.innerHTML = []
    await viagens.forEach(viagem => {
        viagensTabela.innerHTML +=
            `<tr id="${viagem.id}">` +
            '<td class="text-center">' + viagem.descricao + '</td>' +
            '<td class="text-center">' + viagem.valor + '</td>' +
            '<td class="text-center">' + viagem.vagas + '</td>' +
            '<td class="text-center">' + viagem.destino + '</td>' +
            '<td class="text-center">' + `<button id="${viagem.id}" name="btneditar" onclick="abrirDialogEditar(this.id)" class="btn btn-warning mr-2"><i class="fa fa-pencil"></i></button>` +
            `<button id="${viagem.id}" name="btnlinha" onclick="abrirDialogRemover(this.id)" class="btn btn-danger"><i class="fa fa-trash"></i></button>` + '</td></tr>'
    });
}

function abrirDestinos() {
    window.location.href = 'http://127.0.0.1:3000/admin';
}

function fecharDialog() {
    planoRemover.classList = ['naovisivel'];
    planoAdicionarViagem.classList = ['naovisivel'];
}

function pupulaSelect(destinos) {
    var destinosSelect = document.querySelector('#destinoViagem');
    destinosSelect.innerHTML = [];
    destinos.forEach(destino => {
        destinosSelect.innerHTML += 
        `<option value="${destino.id}">${destino.nome}</option>`
    });
}

var destinosRequest = async () => {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    return await fetch('/admin/destinos', {
        method: 'GET',
        headers: headers
    });
}

function listarDestinos() {
    destinosRequest().then(
        async (response) => {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            var destinos = await response.json();
            pupulaSelect(destinos)
        }
    );
}

async function removerViagens() {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    return await fetch('/admin/viagens/' + viagemSelecionada, {
        method: 'DELETE',
        headers: headers
    }).then(
        async (response) => {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            await listarViagens()
            this.fecharDialog();
            destinoSelecionado = null;
            if(response.status === 400) {
                var response = await response.json();
                abrirToasty(response.mensagem);
            }
        }
    );
}

function abrirToasty(mensagem) {
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

function abrirDialogRemover(id) {
    planoRemover.classList = ['plano-ascendente']
    viagemSelecionada = id;
}

function logout() {
    localStorage.clear('token')
    location.href = "http://127.0.0.1:3000/login";
}

function paginaInicial() {
    location.href = "http://127.0.0.1:3000/pagina-inicial";
}

listarDestinos();
listarViagens();