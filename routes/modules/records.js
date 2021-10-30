// 載入需求
const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Record = require('../../models/record')


// new
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const { name, date, category, amount } = req.body
  const userId = req.user._id

  Category
    .findOne({ name: category })
    .lean()
    .then(cate => {
      const categoryId = cate._id
      const icon = cate.icon
      Record.create({
        name, date, amount, userId, categoryId, icon
      })
        .then(() => res.redirect('/'))
    })
    .catch(error => console.log('error'))
})

// edit
router.get('/:id/edit', (req, res) => {

  res.render('edit')
})


module.exports = router