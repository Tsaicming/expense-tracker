const db = require('../../config/mongoose')
const Category = require('../category')
const categorySeed = require('../seeds/category.json').results


db.once('open', () => {
  // 會造成與 recordSeeder 的同步錯誤
  // for (let i = 0; i < categorySeed.length; i++) {
  //   Category.create({
  //     name: categorySeed[i].name,
  //     icon: categorySeed[i].icon
  //   })
  // }
  // console.log('Category seeder finished!')
  // return db.close()

  return Promise.all(Array.from(
    { length: categorySeed.length },
    (_, i) => Category.create({ ...categorySeed[i] })
  ))
    .then(() => {
      console.log('Category seeder finished!')
      return db.close()
    })
})