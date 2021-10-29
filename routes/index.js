// 載入需求
const express = require('express')
const router = express.Router()


// 總路由管理
const { authenticator } = require('../middleware/auth')
const home = require('./modules/home')
const expenses = require('./modules/expenses')
const users = require('./modules/users')

router.use('/expenses', authenticator, expenses)
router.use('/users', users)
router.use('/', authenticator, home)


module.exports = router