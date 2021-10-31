const passport = require('passport')                      // 載入 passport
const LocalStrategy = require('passport-local').Strategy  // 載入 local 認證
const FacebookStrategy = require('passport-facebook').Strategy    // 載入 Facebook 認證
const bcrypt = require('bcryptjs')
const User = require('../models/user')


module.exports = app => {
  // Middleware 初始化
  app.use(passport.initialize())
  app.use(passport.session())

  // Strategies 認證策略 local
  // user name 使用 email 辨別，使用 email 跟 password 驗證
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User
      .findOne({ email })     // 檢查資料庫中有沒有跟使用者輸入的 email 是相同的
      .then(user => {
        if (!user) {          // user 不存在時
          return done(null, false, { message: 'That email is not registered!' })
        }

        // bcrypt.compare()會比較使用者的輸入值與資料的值後，回傳一個布林值
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {    // password 不存在時
            return done(null, false, { message: 'Email or Password incorrect.' })
          }

          return done(null, user) // user 存在且 password 相同時，回傳 user
        })
      })
      .catch(err => done(err, false))
  }))

  // Strategies 認證策略 第三方 Facebook 認證
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  // sessions 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))   // 取出 user 的資訊放在 req.user
      .catch(err => done(err, null))
  })
}