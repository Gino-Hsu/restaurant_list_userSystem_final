const express = require('express')
const passport = require('passport') // 引用 passport
const router = express.Router()

// 載入 User Model
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

// 加入 middleware，驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 取得註冊填入的資料
  const {name, email, password, confirmPassword} = req.body
  // 用 email 從資料庫找尋使用者，如果有找到從心重新導回註冊頁
  // 沒有找到時，資料庫建立使用者資料
  User.findOne({ email }).then(user => {
    if(user) {
      console.log('user aleardy exists.')
      res.render('register', {name, email, password, confirmPassword})
    } else {
      User.create({
        name,
        email,
        password
      })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
    }
  })
  .catch(err => console.log(err))
})

module.exports = router