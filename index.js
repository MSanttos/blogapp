const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
//const bodyParser = require('body-parser')
const port = process.env.PORT ||3030
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const usuarios = require('./routes/usuario')
const passport = require('passport')
require('./config/auth')(passport) 
const db = require('./config/db')

//carrega o model de postagem
require('./models/Postagem')
//declara o model de postagem
const Postagem = mongoose.model('postagens')

//carrega o model de categorias
require('./models/Categoria')
//declara o model de categorias
const Categoria = mongoose.model('categorias')

/***************** 🔧🔨 Settings 🔧🔨 *****************/

//session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//middleware global
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null //armazena os dados do usuario logado
  next()
})

//handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}))
app.set('view engine', 'handlebars')

//body-parser
//app.use(bodyParser.urlencoded({ extended: true }))
//app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//mongoose
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Conectado ao mongodb com sucesso!')
}).catch((err) => {
  console.log('Erro ao conectar: ' + err)
})

app.use(express.static(path.join(__dirname, 'public')))

// *** Routes ***
app.get('/', (req, res) => {
  Postagem.find().populate('categoria').sort({ data: 'desc' }).then((postagens) => {
    res.render('index', { postagens: postagens })
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro interno')
    res.redirect('/404')
  })
})

/******************************************************************/
app.get('/postagem/:slug', (req, res) => {
  Postagem.findOne({ slug: req.params.slug }).then((postagem) => {
    if (postagem) {
      res.render('postagem/index', { postagem: postagem })
    } else {
      req.flash('error_msg', 'Esta postagem não existe')
      res.redirect('/')
    }
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro interno')
    res.redirect('/')
  })
})
/******************************************************************/
//lista categorias
app.get('/categorias', (req, res) => {
  Categoria.find().then((categorias) => {
    res.render('categorias/index', { categorias: categorias })
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro interno')
    res.redirect('/')
  })
})
/******************************************************************/
//lista slug da categoria
app.get('/categorias/:slug', (req, res) => {
  Categoria.findOne({ slug: req.params.slug }).then((categoria) => {//busca categoria pelo slug que tenha como parametro o slug
    if (categoria) {
      Postagem.find({ categoria: categoria._id }).then((postagens) => {
        res.render('categorias/postagens', { postagens: postagens, categoria: categoria })
      }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
      })
    } else {
      req.flash('error_msg', 'Esta categoria não existe')
      res.redirect('/')
    }
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro interno')
    res.redirect('/')
  })
})
/******************************************************************/
//not found
app.get('/404', (req, res) => {
  res.send('Erro 404')
  
})

app.use('/admin', admin)
app.use('/usuarios', usuarios)

app.use(express.json())

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
