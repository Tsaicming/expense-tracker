if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

const bcrypt = require('bcryptjs')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')
const recordSeed = require('../seeds/record.json').results
const userSeed = require('../seeds/user.json').results


db.once('open', async () => {
  for (const user of userSeed) {
    const saltPassword = await bcrypt.genSalt(10).then(salt => bcrypt.hash(user.password, salt));
    const createdUser = await User.create({
      name: user.name,
      email: user.email,
      password: saltPassword
    })
    const recordList = Array.from(user.recordIndex, i => recordSeed[i])

    for (const record of recordList) {
      const category = await Category.findOne({ name: record.category }).lean()
      await Record.create({
        name: record.name,
        date: record.date,
        amount: record.amount,
        userId: createdUser._id,
        categoryId: category._id,
        category: category.name,
        icon: category.icon
      })
    }
  }

  console.log('Record seeder finished!')
  process.exit()
})