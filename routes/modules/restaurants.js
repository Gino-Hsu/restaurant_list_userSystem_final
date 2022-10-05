const express = require('express')
const router = express.Router()
// 引用 Restaurant model
const Restaurant = require('../../models/restaurant')
// 定義首頁路由
// create new restaurant
router.get('/new', (req,res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const {name, name_en, category, image, location, phone, google_map, rating, description} = req.body
  const userId = req.user._id

  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// render show page
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => {res.render('show', {restaurant})})
    .catch(error => console.log(error))
})

// edit restaurant
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => {res.render('edit', {restaurant})})
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const {name, name_en, category, image, location, phone, google_map, rating, description} = req.body
  const _id = req.params.id
  const userId = req.user._id

  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description

      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// delete restaurant
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


module.exports = router