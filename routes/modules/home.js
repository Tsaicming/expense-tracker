// 載入需求
const express = require('express')
const router = express.Router()
const Record = require('../../models/record')


// index ALL
router.get('/', (req, res) => {
  const userId = req.user._id
  let totalAmount = 0
  Record
    .find({ userId })
    .lean()
    .then(record => {
      record.forEach(item => totalAmount += item.amount)
      return res.render('index', { record, totalAmount })
    })
    .catch(error => console.log('error'))
})

// filter
router.get('/filter', (req, res) => {
  const userId = req.user._id
  const { category } = req.query
  const categoryRegex = new RegExp(category)
  let totalAmount = 0
  Record.find({ category: categoryRegex, userId })
    .lean()
    .then(record => {
      record.forEach(item => totalAmount += item.amount)
      return res.render('index', { record, totalAmount, category })
    })
    .catch(error => console.log('error'))
})

module.exports = router