// 載入需求
const express = require('express')
const router = express.Router()


// 總路由管理
const home = require('./modules/home')
const expenses = require('./modules/expenses')

router.use('/expenses', expenses)
router.use('/', home)


module.exports = router