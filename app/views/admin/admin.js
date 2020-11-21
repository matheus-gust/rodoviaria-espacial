var planoAdicionar = document.querySelector('#plano-adicionar');
var planoEditar = document.querySelector('#plano-editar');
var forms = document.getElementsByClassName('needs-validation');
var planoRemover = document.querySelector('#plano-remover');

var toasty = document.querySelector('#toasty');
var mensagemToasty = document.querySelector('#mensagem-toasty');

var suporteTabelaDestino = document.querySelector('#suporte-tabela-destino');

var destinoSelecionado;

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
            popularTabela(destinos);
        }
    );
}

async function popularTabela(destinos) {
    var linhas = document.querySelector('tbody');
    linhas.innerHTML = []
    await destinos.forEach(destino => {
        linhas.innerHTML +=
            `<tr id="${destino.id}">` +
            '<td class="text-center">' + destino.nome + '</td>' +
            '<td class="text-center">' + destino.descricao + '</td>' +
            '<td class="text-center">' + `<button id="${destino.id}" name="btneditar" onclick="abrirDialogEditar(this.id)" class="btn btn-warning mr-2"><i class="fa fa-pencil"></i></button>` +
            `<button id="${destino.id}" name="btnlinha" onclick="abrirDialogRemover(this.id)" class="btn btn-danger"><i class="fa fa-trash"></i></button>` + '</td></tr>'
    });
}

function abrirDialogRemover(id) {
    planoRemover.classList = ['plano-ascendente']
    destinoSelecionado = id;
}
function abrirDialogAdicionar() {
    arquivo.value = "";
    planoAdicionar.classList = ['plano-ascendente']
}

async function abrirDialogEditar(id) {
    planoEditar.classList = ['plano-ascendente'];
    await buscarDestinoPorId(id);
}

async function buscarDestinoPorId(id) {
    await fetch('/admin/destinos-id/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json ',
            'Accept': 'application/json',
            'token': 'Bearer ' + localStorage.getItem('token')
        }
    }).then(
        async function (response) {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            var destino = await response.json();
            console.log(destino)
            destinoSelecionado = destino;
            if(destino.imagem) {
                document.querySelector('#labeleditar').src = destino.imagem
            }
            document.querySelector('#nomeEditar').value = destino.nome;
            document.querySelector('#descricaoEditar').value = destino.descricao;
        }
    )
}

async function salvarAlteracoesDestino() {
    if (forms[1].checkValidity() == false) {
        forms[1].classList.add('was-validated');
        return;
    }
    var imagemB64;
    if (editar.files[0]) {
        imagemB64 = await toBase64(editar.files[0]);
    } else {
        imagemB64 = imgperfil.src
    }

    var nome = document.querySelector('#nomeEditar').value;
    var descricao = document.querySelector('#descricaoEditar').value;
    var destino = { id: destinoSelecionado.id, nome: nome, descricao: descricao, imagem: imagemB64 };

    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    await fetch('/admin/destinos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json ',
            'Accept': 'application/json',
            'token': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(destino)
    }).then(
        async function (response) {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            this.fecharDialog();
            await this.listarDestinos();
            destinoSelecionado = null;
            abrirToasty('Destino editado com sucesso');
        }
    )
}

async function removerDestino() {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    return await fetch('/admin/destinos/' + destinoSelecionado, {
        method: 'DELETE',
        headers: headers
    }).then(
        async (response) => {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            await this.listarDestinos();
            this.fecharDialog();
            destinoSelecionado = null;
            if (response.status === 400) {
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

function fecharDialog() {
    planoRemover.classList = ['naovisivel'];
    planoAdicionar.classList = ['naovisivel'];
    planoEditar.classList = ['naovisivel'];
    imgperfil.src = '/assets/baixados.png';
    labeleditar.src = '/assets/baixados.png';
}

async function adicionarDestino() {
    var arquivos = document.querySelector('#arquivo');
    if (forms[0].checkValidity() == false) {
        forms[0].classList.add('was-validated');
        return;
    }
    var imagemB64;
    if (arquivos.files[0]) {
        imagemB64 = await toBase64(arquivos.files[0]);
    } else {
        imagemB64 = imgperfil.src
    }
    var nome = document.querySelector('#nome').value;
    var descricao = document.querySelector('#descricao').value;
    var destino = { nome: nome, descricao: descricao, imagem: imagemB64 };
    console.log(destino)
    await fetch('/admin/destinos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json ',
            'Accept': 'application/json',
            'token': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(destino)
    }).then(
        async function (response) {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            if (response.status === 400) {

            }
            this.fecharDialog();
            await this.listarDestinos();
            document.querySelector('#nome').value = null;
            document.querySelector('#descricao').value = null;
            abrirToasty('Destino adicionado com sucesso');
        }
    )
}

function abrirViagem() {
    window.location.href = 'http://127.0.0.1:3000/admin/viagens'
}

function logout() {
    localStorage.clear('token')
    location.href = "http://127.0.0.1:3000/login";
}

function paginaInicial() {
    location.href = "http://127.0.0.1:3000/pagina-inicial";
}

async function definirImagem() {
    var imagemB64;
    imagemB64 = await toBase64(arquivo.files[0]);
    imgperfil.src = imagemB64;
}

async function definirImagemEditar() {
    var imagemB64;
    console.log(editar.files)
    imagemB64 = await toBase64(editar.files[0]);
    labeleditar.src = imagemB64;
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

listarDestinos();


///////////////////////////////////////////////////////////////////////
