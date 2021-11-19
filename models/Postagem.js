const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new Schema({
  titulo: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  categoria: {
    type: Schema.Types.ObjectId,//faz referencia ao model categoria que esta no models armazena o ID de uma categoria
    ref: 'categorias', //referencia ao model categoria
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('postagens', Postagem)
