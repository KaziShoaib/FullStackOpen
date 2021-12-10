const jwt = require('jsonwebtoken')

const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info('Method : ',req.method)
  logger.info('Path : ',req.path)
  logger.info('Body : ',req.body)
  logger.info('---')
  next()
}


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error : 'unknown endpoint' })
}


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  //console.log(authorization)
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  //console.log(token)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if(!token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //console.log(decodedToken.id)
  request.user = await User.findById(decodedToken.id)
  //console.log(user)
  next()
}

const errorHandler = (error, req, res, next) => {
  //logger.info('from middleware')
  //logger.error(error.message)
  logger.error(error.name)
  //console.log(error)

  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformed id' })
  }
  if(error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  }
  if(error.name === 'JsonWebTokenError'){
    return res.status(401).json({ error: 'invalid token' })
  }

  next(error)
}


module.exports = { requestLogger, unknownEndpoint, tokenExtractor, userExtractor, errorHandler }