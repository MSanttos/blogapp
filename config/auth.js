const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Model de usuario
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

module.exports = function(passport){
  passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'senha'
  }, (email, senha, done) => {
    Usuario.findOne({email: email}).then((usuario) => {
      if(!usuario){
        //done função de callback
        return done(null, false, {message: 'Esta conta não existe'})
      }
      //se a conta existir compara os dados
      bcrypt.compare(senha, usuario.senha, (erro, batem) => {
        if(batem){
          return done(null, usuario)
        }else{
          return done(null, false, {message: 'Senha incorreta'})
        }
      })
    })
  }))

  passport.serializeUser((usuario, done) => {
    //guarda os dados em uma sessão apos o login
    done(null, usuario.id)
  })

  passport.deserializeUser((id, done) => {
    //procura usuario pelo id
    Usuario.findById(id, (err, usuario) => {
      done(err, usuario)
    })
  })
}

