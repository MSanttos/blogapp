//midlleware para verificar se o usuario é admin
module.exports = {
  isAdmin: function(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin == 1) {
        return next();
      }
    }
    req.flash('error', 'Você precisa logar como admin.');
    res.redirect('/');
  }
}