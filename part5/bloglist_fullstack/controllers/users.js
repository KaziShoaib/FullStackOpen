const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body
  if(!body.password || body.password.length < 3)
    return response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})


// usersRouter.delete('/all', async (request, response) => {
//   await User.deleteMany({})
//   response.status(204).end()
// })

module.exports = usersRouter