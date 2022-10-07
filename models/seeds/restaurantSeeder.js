const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')
let restaurantList = require('../../restaurant.json').results //載入餐廳種子資料
let SEED_Users = require('../../users.json').users //載入使用者種子資料

const db = require('../../config/mongoose')

//連線成功
db.once('open', () => {
  Promise
    .all(SEED_Users.map(user => {
      const { name, email, password, indexField } = user
      return User.create(
      {
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        /*bcrypt.hash takes a callback as its third parameter which will be called when the hash is completed. bcrypt.hashSync runs the hash, waits for it to complete and returns the hashed value.*/
      })
      .then(user => {
        const restaurants = indexField.map(index => {
          const restaurant = restaurantList[index]
          restaurant.userId = user._id
          return restaurant
        })
      return Restaurant.create(restaurants)
      })
    }))
    .then(() => {
      console.log('restaurantSeeder done!')
      process.exit()
    })
    .then(() => db.close())
    .catch(error => console.error(error))
})

// 連線成功
// db.once('open', () => {
//   // 建立種子資料
//   Restaurant.create(restaurantList)
//     .then(() => {
//       console.log("restaurantSeeder done!")
//       db.close()
//     })
//     .catch(error => console.log(error))
// })