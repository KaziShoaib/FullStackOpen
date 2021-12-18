const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')


const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


const url = config.MONGODB_URI
logger.info(`connecting to ${url}`)
mongoose.connect(url)
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error(`error connecting to Mongo ${error.message}`)
  })


app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if(process.env.NODE_ENV==='test'){
  const testRouter = require('./controllers/testing')
  app.use('/api/testing', testRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app