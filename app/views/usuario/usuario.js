var idUsuarioLogado;

async function buscarComprador() {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    return await fetch('/usuario/usuario', {
        method: 'GET',
        headers: headers
    }).then(
        async (response) => {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            var usuario = await response.json();
            idUsuarioLogado = usuario.id;
            popularFormulario(usuario)
        }
    );
}

function popularFormulario(usuario) {
    nome.value = usuario.nome;
    email.value = usuario.email;
    cpf.value = usuario.cpf
    imgperfil.src = usuario.imagem;
}

async function definirImagem() {
    var imagemB64 = await toBase64(arquivo.files[0]);
    imgperfil.src = imagemB64;
}


async function salvarAlteracoesUsuario() {
    if (formUsuario.checkValidity() == false) {
        formUsuario.classList.add('was-validated');
        return;
    }
    var imagemB64;
    if(arquivo.files[0]) {
        imagemB64 = await toBase64(arquivo.files[0]);
    } else {
        imagemB64 = imgperfil.src
    }
    var nomeAtualizar = nome.value;
    var cpfAtualizar = cpf.value;
    var emailAtualizar = email.value;
    var idAtualizar = idUsuarioLogado;
    
    var usuarioAtualizar = {id: idAtualizar, nome: nomeAtualizar, cpf: cpfAtualizar, email: emailAtualizar, imagem: imagemB64}
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    await fetch('/usuario/editar-usuario', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json ',
            'Accept': 'application/json',
            'token': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(usuarioAtualizar)
    }).then(
        async function (response) {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            buscarComprador();
            abrirToasty('Usuario editado com sucesso');
        }
    )
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

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

function logout() {
    localStorage.clear('token')
    location.href="http://127.0.0.1:3000/login";
}

function paginaInicial() {
    location.href="http://127.0.0.1:3000/pagina-inicial";
}



buscarComprador();