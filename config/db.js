process.env.NODE_ENV = 'production'
if(process.env.NODE_ENV == 'production'){
  module.exports = {mongoURI: 'mongodb://michel:J7pF8Jd7JCFEgZC@cluster0-shard-00-02.emo50.mongodb.net:27017/blogapp?authSource=admin&readPreference=primary&directConnection=true&ssl=true'}
}else{
  module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}
