// require packages used in the project
const express = require('express')
const session = require('express-session') // 載入 express session
const usePassport = require('./config/passport') // 載入 passport 模組
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes') // 引用路由器
const flash = require('connect-flash') // 引用 flash 套件

require('./config/mongoose')

// setting template engine
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// setting static files
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  res.locals.error = req.flash('error') // 設定登入錯誤訊息
  next()
})

app.use(routes) // 將 request 導入路由器


app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})