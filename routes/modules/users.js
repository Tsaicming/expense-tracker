// 載入需求
const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')


// 使用者登入 login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {  // 使用 local 驗證機制
  successRedirect: '/',               // 驗證成功時
  failureRedirect: '/users/login'     // 驗證失敗時
}))

// 使用者註冊 register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  // 註冊輸入資訊不完整時
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  // 註冊輸入資訊完整時
  // 檢查資料庫中有沒有跟使用者輸入的 email 是相同的，如果有的話，會回傳一個 user
  User
    .findOne({ email })
    .then(user => {
      // true 如果己經註冊過
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }

      // false 如果還沒註冊，把資料寫入資料庫
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

// 使用者登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經登出。')
  res.redirect('/users/login')
})


module.exports = router