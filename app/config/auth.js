const localStrategy = require("passport-local").Strategy
const usuarioRepository = require('../db/usuario.db.js');
const bcrypt = require("../../node_modules/bcrypt/bcrypt.js");

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'email' }, (email, senha, done) => {
        usuarioRepository.findByEmail(email).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: "Usuario inexistente" });
            }
            bcrypt.compare(senha, usuario.senha, (erro, sucesso) => {
                if (sucesso) {
                    return done(null, usuario);
                } else {
                    return done(null, false, { message: "Senha incorreta" });
                }
            });
        });
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        usuarioRepository.findById(id);
    })
}