if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../category')
const categorySeed = require('../seeds/category.json').results

db.once('open', () => {
  return Promise.all(Array.from(
    { length: categorySeed.length },
    (_, i) => Category.create({ ...categorySeed[i] })
  ))
    .then(() => {
      console.log('Category seeder finished!')
      process.exit()
    })
})