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
  failureRedirect: '/users/login',
  badRequestMessage: '所有欄位為必填！',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 取得註冊填入的資料
  const {name, email, password, confirmPassword} = req.body
  // 空陣列，存錯誤訊息
  const wrong_msgs = []
  // 加入錯誤訊息
  if (!email || !password || !confirmPassword) {
    wrong_msgs.push({ message: 'Email, Password & ConfirmPassword 為必填。' })
  }
  if (password !== confirmPassword) {
    wrong_msgs.push({ message: '密碼與確認密碼不相符。' })
  }
  if (wrong_msgs.length) {
    return res.render('register', {
      wrong_msgs,
      name,
      email,
      password,
      confirmPassword
    })
  }

  // 用 email 從資料庫找尋使用者，如果有找到從心重新導回註冊頁
  // 沒有找到時，資料庫建立使用者資料
  User.findOne({ email }).then(user => {
    if (user) {
      wrong_msgs.push({ message: '這個 Email 已被註冊過了。' })
      return res.render('register', {wrong_msgs, name, email, password, confirmPassword})
    }
    return User.create({
      name,
      email,
      password
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router