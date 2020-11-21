var forms = document.getElementsByClassName('needs-validation');
var enviar = document.querySelector('#enviar');
var mensagemErro = document.querySelector('#mensagemErro');

(function () {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      enviar.addEventListener('onclick', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, false);
    });
  }, false);
})();

var loginRequest = async () => {
  var email = document.querySelector('#idemail').value;
  var senha = document.querySelector('#idsenha').value;
  var usuario = { email: email, senha: senha }
  return await fetch('/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json ',
      'Accept': 'application/json'
    },
    body: JSON.stringify(usuario)
  });
}

function login() {
  mensagemErro.style = 'display: none;';
  if (forms[0].checkValidity() == false) {
    forms[0].classList.add('was-validated');
    return;
  }
  var spinner = document.querySelector('#spinner');
  var entrar = document.querySelector('#entrar');
  spinner.style.display = 'block';
  entrar.style.display = 'none';
  loginRequest().then(
    async function (response) {
      if (response.status === 200) {
        var token = await response.json();
        var valorToken = token.token;
        localStorage.setItem('token', valorToken);
        location.href = 'http://127.0.0.1:3000/pagina-inicial';
      }
      var mensagem = await response.json();
      mostrarMensagemErro(mensagem['mensagem']);
      spinner.style.display = 'none';
      entrar.style.display = 'block';
    }
  ).catch(function (error) {
    spinner.style.display = 'none';
    entrar.style.display = 'block';
  });
}

function mostrarMensagemErro(mensagem) {
  mensagemErro.innerHTML = mensagem;
  mensagemErro.style = 'display: block;margin: 0; color: rgb(208, 0, 0);';
}