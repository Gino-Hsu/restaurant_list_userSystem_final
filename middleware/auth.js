module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '請先登入才可以使用。') // 警告提示訊息
    res.redirect('/users/login')
  }
}