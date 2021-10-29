// 載入需求
const express = require('express')
const router = express.Router()


// 總路由管理
const home = require('./modules/home')
const expenses = require('./modules/expenses')
const users = require('./modules/users')

router.use('/expenses', expenses)
router.use('/users', users)
router.use('/', home)


module.exports = router