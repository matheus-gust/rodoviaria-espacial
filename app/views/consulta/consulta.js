function logout() {
    localStorage.clear('token')
    location.href = "http://127.0.0.1:3000/login";
}

function paginaInicial() {
    location.href = "http://127.0.0.1:3000/pagina-inicial";
}

var consultaRequest = async () => {
    var headers = new Headers();
    headers.append('token', 'Bearer ' + localStorage.getItem('token'));
    return await fetch('/consulta/listar', {
        method: 'GET',
        headers: headers
    });
}

function listarConsulta() {
    consultaRequest().then(
        async (response) => {
            if (response.status === 423) {
                location.href = 'http://127.0.0.1:3000/login';
            }
            var consultas = await response.json();
            popularTabela(consultas);
        }
    );
}

async function popularTabela(consultas) {
    var linhas = document.querySelector('tbody');
    linhas.innerHTML = []
    await consultas.forEach(consultas => {
        linhas.innerHTML +=
            `<tr>` +
            '<td class="text-center">' + consultas.descricao + '</td>' +
            '<td class="text-center">' + consultas.valor + '</td>' +
            '<td class="text-center">' + consultas.nome + '</td></tr>'
    });
}
listarConsulta()