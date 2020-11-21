const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const usuarioService = require("./app/service/usuario.service");
const destinoService = require("./app/service/destino.service");
const viagemService = require("./app/service/viagem.service");
const consultaService = require("./app/service/consulta.service");

const REGRA_ADMIN = 'RULE_REST_ADMIN';
const REGRA_USUARIO = 'RULE_REST_USUARIO';

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/assets', express.static(__dirname + '/app/assets'));
app.use('/views', express.static(__dirname + '/app/views'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/jquery.js'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/app/views/home/home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/app/views/login/login.html');
});

app.post('/login', async (req, res) => {
    try {
        if (req.body.email, req.body.senha) {
            const credenciais = { email: req.body.email, senha: req.body.senha }
            const token = await usuarioService.efetuaLogin(credenciais);
            if (token) {
                res.status(200).header({ 'Content-Type': 'application/json' }).json({ token: token });
            } else {
                res.status(423).header({ 'Content-Type': 'application/json' }).json({ mensagem: 'Email ou senha incorretos' });
            }
        } else {
            res.status(404).send({ mensagem: 'Credenciais não enviadas' });
        }
    } catch {
        res.status(500).send({ mensagem: 'Falha ao entrar tente novamente mais tarde' });
    }
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/app/views/cadastro/cadastro.html')
});

app.post('/register', async (req, res) => {
    try {
        if (req.body.nome, req.body.cpf, req.body.email, req.body.senha) {
            let usuario = { nome: req.body.nome, cpf: req.body.cpf, email: req.body.email, senha: req.body.senha }
            serverResponse = await usuarioService.insereUsuario(usuario);
            res.status(201).redirect('/login');
        } else {
            res.status(400).statusMessage('Preencher todos os campos').sendFile(__dirname + '/app/views/cadastro/cadastro.html');
        }
    } catch {
        res.sendFile(__dirname + '/app/views/cadastro/cadastro.html');
    }

});

app.get('/usuario', (req, res) => {
    res.sendFile(__dirname + '/app/views/usuario/usuario.html');
});

app.get('/pagina-inicial', (req, res) => {
    res.sendFile(__dirname + '/app/views/pagina-inicial/pagina-inicial.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/app/views/admin/admin.html');
});

app.get('/consulta', (req, res) => {
    res.sendFile(__dirname + '/app/views/consulta/consulta.html');
});

app.get('/admin/viagens', (req, res) => {
    res.sendFile(__dirname + '/app/views/admin/viagens/viagens.html');
});

app.get('/admin/destinos', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN) {
            var destinos = await destinoService.listaDestinos();
            console.log(destinos)
            res.send(destinos);
        } else {
            res.sendStatus(423);
        }
    }
});

app.get('/admin/destinos-id/:id', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN) {
            var id = req.params.id;
            if (id !== null) {
                var destino = await destinoService.buscarDestino(id);
                res.status(200).send(destino);
            } else {
                res.status(400);
            }
        } else {
            res.sendStatus(423);
        }
    }
});

app.put('/admin/destinos', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN) {
            var destino = { id: req.body.id, nome: req.body.nome, descricao: req.body.descricao, imagem: req.body.imagem }
            if (destino.nome !== null && destino.descricao !== null) {
                await destinoService.editaDestino(destino);
                res.status(201).send();
            } else {
                res.status(400).send();
            }
        } else {
            res.sendStatus(423);
        }
    }
});

app.post('/admin/destinos', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN) {
            console.log(req.body)
            var destino = { nome: req.body.nome, descricao: req.body.descricao, imagem: req.body.imagem }
            if (destino.nome !== null && destino.descricao !== null) {
                await destinoService.insereDestino(destino);
                res.status(201).send();
            } else {
                res.status(400).send();
            }
        } else {
            res.sendStatus(423);
        }
    }
});

app.delete('/admin/destinos/:id', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN || usuario.permissao === REGRA_USUARIO) {
            try {
                await destinoService.excluirDestino(req.params.id);
                res.send();
            } catch {
                res.status(400).send({ mensagem: 'Não é possivel excluir o destino pois existem viagens ligadas a ele' });
            }
        } else {
            res.sendStatus(423);
        }
    }
});

app.post('/admin/viagens', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN) {
            var viagem = {
                descricao: req.body.descricao,
                valor: req.body.valor,
                vagas: req.body.vagas,
                destino: req.body.destino
            }
            if (
                viagem.descricao &&
                viagem.valor &&
                viagem.vagas &&
                viagem.destino
            ) {
                const response = await viagemService.insereViagem(viagem);
                console.log(response)
                if (!response) {
                    res.status(400).send({ mensagem: 'Destino não encontrado na base de dados' })
                }
                res.status(201).send();
            } else {
                res.status(400).send();
            }
        } else {
            res.sendStatus(423);
        }
    }
});

app.get('/admin/viagens/listar', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN) {
            var viagens = await viagemService.listaViagens();
            res.send(viagens);
        } else {
            res.sendStatus(423);
        }
    }
});

app.get('/pagina-inicial/listar', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN || usuario.permissao === REGRA_USUARIO) {
            var viagens = await viagemService.listaViagens();
            res.send(viagens);
        } else {
            res.sendStatus(423);
        }
    }
});

app.get('/pagina-inicial/listar-viagens-imagens', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN || usuario.permissao === REGRA_USUARIO) {
            var viagens = await viagemService.listaViagensImagens();
            res.send(viagens);
        } else {
            res.sendStatus(423);
        }
    }
});

app.get('/pagina-inicial/usuario', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN || usuario.permissao === REGRA_USUARIO) {
            var usuario = await usuarioService.buscaUsuario(usuario.email);
            res.send({ nome: usuario.nome, email: usuario.email, id: usuario.id, credito: usuario.credito });
        } else {
            res.sendStatus(423);
        }
    }
});

app.post('/pagina-inicial/ingressar/:idviagem', async (req, res) => {
    var idviagem = req.params.idviagem;
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN || usuario.permissao === REGRA_USUARIO) {
            var retorno = await usuarioService.adicionarViagemAoUsuario(usuario, idviagem);
            switch (retorno) {
                case 0:
                    res.sendStatus(200);
                    break;
                case 1:
                    res.sendStatus(400);
                    break;
                case 2:
                    res.sendStatus(423);
                    break;
            }
        }
    }
    // res.sendFile(__dirname + '/app/views/pagina-inicial/pagina-inicial.html');
});

app.delete('/admin/viagens/:id', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN) {
            try {
                await viagemService.excluirViagem(req.params.id);
                res.send();
            } catch {
                res.status(400).send({ mensagem: 'Não é possivel excluir a viagem pois existem usuarios ligadas a ela' });
            }
        } else {
            res.sendStatus(423);
        }
    }
});

app.get('/usuario/usuario', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN || usuario.permissao === REGRA_USUARIO) {
            var usuario = await usuarioService.buscaUsuario(usuario.email);
            res.send({ nome: usuario.nome, email: usuario.email, id: usuario.id, cpf: usuario.cpf, imagem: usuario.imagem });
        } else {
            res.sendStatus(423);
        }
    }
});

app.put('/usuario/editar-usuario', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN || usuario.permissao === REGRA_USUARIO) {
            var usuario = await usuarioService.editaUsuario(req.body);
            res.send({ nome: usuario.nome, email: usuario.email, id: usuario.id, cpf: usuario.cpf, imagem: usuario.imagem });
        } else {
            res.sendStatus(423);
        }
    }
});

app.get('/consulta/listar', async (req, res) => {
    var usuario = parseJwt(req.headers['token']);
    if (usuario == null) {
        res.sendStatus(423);
    } else {
        if (usuario.permissao === REGRA_ADMIN || usuario.permissao === REGRA_USUARIO) {
           const compras = await consultaService.consultaCompra(usuario);
           res.send(compras)
        } else {
            res.sendStatus(423);
        }
    }
});


app.listen(3000, function () {
    console.log("Servidor iniciado - porta 3000");
});

function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};