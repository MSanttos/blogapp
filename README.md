# deploy
👉 https://blogprod.herokuapp.com/

# npm init
👉 inicializa package.json

# npm install express --save
👉 install express npm

# npm install --save-dev nodemon
👉 install nodemon npm

# npm install --save express-handlebars
👉 permite chamar variáveis do back-end no front

# npm install --save body-parser
👉 recebe dados de qualquer formulário da página

# instalação mongoose
👉 npm install --save mongoose

# instalação de express-session pra armazenar dados em sessões 
👉 npm install --save express-session

# instalação do connect flash
👉 npm install --save connect-flash

# pacote para criar hash nas senhas
👉 npm install --save bcryptjs

# caso precise atualizar a versão
👉 npm install --save handlebars@4.5.3

# instalação do passportjs para autenticação e login de usuario
👉 npm install --save passport
<!-- estratégia de login -->
👉 npm install --save passport-local

### para fazer deploy
👉 pasta do projeto
👉 npm init
👉 criar scripr para rodar segue exemplo:

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
  👉"start": "node index.js"
  },

👉 const port = process.env.PORT ||3030
👉 https://mlab.com/
👉

<!-- ## starter de server ## -->
### ==> nodemon index.js 

<!-- req requisição que recebemos -->
<!-- res resposta para o cliente -->

<!-- outra forma de deletar -->
<!-- router.get('/postagens/deletar/:id', (req, res) => {
  Postagem.remove({_id: req.params.id}).then(() =>{
    req.flash('success_msg', 'Postagem deletada com sucesso')
    res.redirect('/admin/postagens')
  }).catch((err) =>{
    req.flash('error_msg', 'Houve um errro ao deletar')
    res.redirect('/admin/postagens')
  })
}) -->

