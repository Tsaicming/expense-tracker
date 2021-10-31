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
  const userId = req.user._id
  const _id = req.params.id
  Record.findOne({ _id, userId })
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log('error'))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const { name, date, category, amount } = req.body
  const _id = req.params.id
  Category
    .findOne({ name: category })
    .lean()
    .then(cate => {
      const categoryId = cate._id
      const icon = cate.icon
      Record
        .findOne({ _id, userId })
        .then(record => {
          record.name = name,
            record.date = date,
            record.amount = amount,
            record.categoryId = categoryId,
            record.icon = icon
          return record.save()
        })
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log('error'))
})


router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Record
    .findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log('error'))
})


module.exports = router