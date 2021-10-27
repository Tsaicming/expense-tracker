// 載入需求
const express = require('express')
const router = express.Router()


// new
router.get('/new', (req, res) => {
  res.render('new')
})

// edit
router.get('/edit', (req, res) => {
  res.render('edit')
})


module.exports = router