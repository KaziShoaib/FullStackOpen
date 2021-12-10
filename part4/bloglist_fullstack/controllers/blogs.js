const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor ,async (request, response, next) => {
  const body = request.body

  const user = request.user

  if(!user)
    return response.status(404).json({ error: 'user has been removed' })

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  const modifiedUser = {
    username: user.username,
    passwordhash: user.passwordhash,
    name: user.name,
    blogs: user.blogs.concat(savedBlog._id)
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, modifiedUser, { new: true, runValidators: true })

  response.json(savedBlog)
})


// blogsRouter.delete('/all', async (request, response, next) => {
//   await Blog.deleteMany({})
//   response.status(204).end()
// })


blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  const user = request.user
  if(!user)
    return response.status(404).json({ error: 'user has been removed' })

  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    return response.status(204).end()
  }

  if(blog.user.toString() !== user._id.toString()){
    return response.status(401).json({
      error: 'a blog can only be deleted by its user'
    })
  }

  await Blog.findByIdAndRemove(request.params.id)

  const modifiedUser = {
    name: user.name,
    username: user.username,
    passwordhash: user.passwordhash,
    blogs: user.blogs.filter(blogId => blogId.toString() !== request.params.id.toString())
  }
  await User.findByIdAndUpdate(user._id, modifiedUser, { new: true, runValidators: true })

  response.status(204).end()
})


blogsRouter.put('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
  const user = request.user
  if(!user)
    return response.status(404).json({ error: 'user has been removed' })

  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).json({ error: 'blog has been removed' })
  }

  //console.log(user)
  //console.log(blog)
  if(blog.user.toString() !== user._id.toString()){
    return response.status(401).json( { error : 'a blog can only be edited by its user' })
  }

  const modifieBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: request.user
  }
  const editedBlog = await Blog.findByIdAndUpdate(request.params.id, modifieBlog, { new: true, runValidators:true })
  if(editedBlog)
    response.json(editedBlog)
  else
    response.status(404).end()
})


module.exports = blogsRouter