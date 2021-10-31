const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const helpers = require('handlebars-helpers')
const comparison = helpers.comparison()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
const usePassport = require('./config/passport')

const app = express()
const port = process.env.PORT

require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)  // 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
app.use(flash())
app.use((req, res, next) => {   // 需放在 usePassport(app) 後，app.use(routes) 前
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})