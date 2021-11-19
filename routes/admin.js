const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')//importa 
require('../models/Categoria')//chama arquivo do model
const Categoria = mongoose.model('categorias')//chama função do model

require('../models/Postagem')
const Postagem = mongoose.model('postagens')

const {isAdmin} = require('../helpers/isAdmin')


router.get('/', isAdmin, (req, res) => {
  res.render('admin/index')
})

router.get('/posts', isAdmin, (req, res) => {
  res.send('Página de posts')
})

router.get('/categorias', isAdmin, (req, res) => {
  Categoria.find().sort({date: 'desc'}).then((categorias) => {
  res.render('admin/categorias', {categorias: categorias})
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao listar as categorias!')
    res.redirect('/admin')
  })
})

router.get('/categorias/add', isAdmin, (req, res) => {
  res.render('admin/addcategorias')
})

router.post('/categorias/nova', isAdmin, (req, res) => {

  var erros = []

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) { //verifica se o nome está preenchido  e se é diferente de undefined e null 
    erros.push({ texto: 'Nome inválido!' }) //se não estiver preenchido, adiciona um erro
  }

  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) { //verifica se o slug está preenchido  e se é diferente de undefined e null
    erros.push({ texto: 'Slug inválido!' }) //se não estiver preenchido, adiciona um erro
  }

  if (req.body.nome.length < 2) { //verifica se o nome tem mais de 2 caracteres 
    erros.push({ texto: 'Nome da categoria muito curto!' }) //se não tiver, adiciona um erro
  }

  if (erros.length > 0) { //se tiver erros, retorna para a página de categorias com os erros
    res.render('admin/addcategorias', { erros: erros })

  } else { //se não tiver erros, salva no banco de dados
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
      req.flash('success_msg', 'Categoria criada com sucesso!')
      console.log('Categoria salva com sucesso')
      res.redirect('/admin/categorias')
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao salvar a categoria!')
      console.log('Erro ao salvar categoria')
      res.redirect('/admin/categorias')
    })
  }
})

//edição de categorias
router.get('/categorias/edit/:id', isAdmin, (req, res) => {
  Categoria.findOne({_id: req.params.id}).then((categoria) => {
    res.render('admin/editcategorias', {categoria: categoria})
  }).catch((err) => {
    req.flash('error_msg', 'Esta categoria não existe!')
    res.redirect('/admin/categorias')
  })
})

//edição
router.post('/categorias/edit', isAdmin, (req, res) => {
  Categoria.findOne({_id: req.body.id}).then((categoria) => {
    categoria.nome = req.body.nome
    categoria.slug = req.body.slug

    categoria.save().then(() => {
      req.flash('success_msg', 'Categoria editada com sucesso!')
      res.redirect('/admin/categorias')
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria!')
      res.redirect('/admin/categorias')
    })
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao editar a categoria')
    res.redirect('/admin/categorias')
  })
})

router.post('/categorias/delete', isAdmin, (req, res) => {
  Categoria.remove({_id: req.body.id}).then(() => {
    req.flash('success_msg', 'Categoria deletada com sucesso!')
    res.redirect('/admin/categorias')
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao deletar a categoria!')
    res.redirect('/admin/categorias')
  })
})



// Routes postagens

router.get('/postagens', isAdmin, (req, res) => {
  //populate é para trazer os dados da categoria e mostrar na tela
  Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens) => { 
    res.render('admin/postagens', {postagens: postagens})
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao listar as postagens!')
    res.redirect('/admin')
  })
  // res.render('admin/postagens')
})

router.get('/postagens/add', isAdmin, (req, res) => {
  Categoria.find().then((categorias) => {
    res.render('admin/addpostagem', {categorias: categorias})
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao listar as categorias!')
    res.redirect('/admin')
  })
})

router.post('/postagens/nova', isAdmin, (req, res) => {
  var erros = []

  if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) { //verifica se o nome está preenchido  e se é diferente de undefined e null 
    erros.push({ texto: 'Título inválido!' }) //se não estiver preenchido, adiciona um erro
  }

  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) { //verifica se o slug está preenchido  e se é diferente de undefined e null
    erros.push({ texto: 'Slug inválido!' }) //se não estiver preenchido, adiciona um erro
  }

  if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) { //verifica se o nome está preenchido  e se é diferente de undefined e null 
    erros.push({ texto: 'Descrição inválida!' }) //se não estiver preenchido, adiciona um erro
  }

  if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) { //verifica se o nome está preenchido  e se é diferente de undefined e null 
    erros.push({ texto: 'Conteúdo inválido!' }) //se não estiver preenchido, adiciona um erro
  }

  if(req.body.categoria == '0'){
    erros.push({ texto: 'Categoria inválida!' }) //se não estiver preenchido, adiciona um erro
  }

  if (erros.length > 0) { //se tiver erros, retorna para a página de categorias com os erros
    res.render('admin/addpostagem', { erros: erros })
  }
  else {
    const novaPostagem = {
      titulo: req.body.titulo,
      slug: req.body.slug,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria
    }
    new Postagem(novaPostagem).save().then(() => {
      req.flash('success_msg', 'Postagem criada com sucesso!')
      console.log('Postagem salva com sucesso')
      res.redirect('/admin/postagens')
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao salvar a postagem!')
      console.log('Erro ao salvar postagem')
      res.redirect('/admin/postagens')
    })
  }
})

//edição
router.get('/postagens/edit/:id', isAdmin, (req, res) => {
  Postagem.findOne({_id: req.params.id}).then((postagem) => {
    //lista as categorias
    Categoria.find().then((categorias) => {
      res.render('admin/editpostagem', {postagem: postagem, categorias: categorias})
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao listar as categorias!')
      res.redirect('/admin/postagens')
    })
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição!')
    res.redirect('/admin/postagens')
  })
})

//aualização de postagens
router.post('/postagens/edit', isAdmin, (req, res) => {
  Postagem.findOne({_id: req.body.id}).then((postagem) => {//pesquisa por uma postagem que tem id igual ao id do formulário
    postagem.titulo = req.body.titulo
    postagem.slug = req.body.slug
    postagem.descricao = req.body.descricao
    postagem.conteudo = req.body.conteudo
    postagem.categoria = req.body.categoria
    postagem.save().then(() => {
      req.flash('success_msg', 'Postagem editada com sucesso!')
      res.redirect('/admin/postagens')
    }).catch((err) => {//se não char tratamos o erro
      req.flash('error_msg', 'Houve um erro interno ao salvar a edição da postagem!')
      res.redirect('/admin/postagens')
    })
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao editar a postagem!')
    res.redirect('/admin/postagens')
  })
})

//deletando postagens
router.post('/postagens/deletar', isAdmin, (req, res) => {
  Postagem.remove({_id: req.body.id}).then(() => {
    req.flash('success_msg', 'Postagem deletada com sucesso!')
    res.redirect('/admin/postagens')
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao deletar a postagem!')
    res.redirect('/admin/postagens')
  })
})

module.exports = router