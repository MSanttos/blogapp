const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get('/registro', (req, res) => {
  res.render('usuarios/registro')
})

/******************************************************************/
//registro e verificação
router.post('/registro', (req, res) => {
  let erros = []
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: 'Nome inválido.' })
  }
  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({ texto: 'E-mail inválido' })
  }
  if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({ texto: 'Senha inválida.' })
  }
  if (req.body.senha.length < 6) {
    erros.push({ texto: 'Senha muito curta.' })
  }
  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: 'Senhas não conferem.' })  
  }
  if (erros.length > 0) {
    res.render('usuarios/registro', { erros: erros })
  } else {
    Usuario.findOne({ email: req.body.email }).then((usuario) => {
      if (usuario) {
        req.flash('error_msg', 'Já existe um usuário com esse email.')
        res.redirect('/usuarios/registro')
      } else {
        const novoUsuario = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha
          //isAdmin: 1
        })

            bcrypt.genSalt(10, (erro, salt) => {
              bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                if (erro) {
                  req.flash('error_msg', 'Houve um erro ao registrar o usuário.')
                  res.redirect('/usuarios/registro')
                }
                
            novoUsuario.senha = hash

            novoUsuario.save().then(() => {
              req.flash('success_msg', 'Usuário cadastrado com sucesso.')
              res.redirect('/')
            }).catch((err) => {
              req.flash('error_msg', 'Houve um erro ao cadastrar o usuário.')
              res.redirect('/usuarios/registro')
            })
          })
        })
      }
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao cadastrar o usuário.')
      res.redirect('/usuarios/registro')
    })
  }
})

/******************************************************************/
//router login
router.get('/login', (req, res) => {
  res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/usuarios/login',
    failureFlash: true
  })(req, res, next)
})

//logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Deslogado com sucesso.')
  res.redirect('/')
})


/******************************************************************/
//passport middleware de autenticação específico para express nodejs

module.exports = router