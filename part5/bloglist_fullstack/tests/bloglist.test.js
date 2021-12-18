const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

let authHeader = {}


beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)
  const userObject = new User({
    username: helper.initialUser.username,
    name: helper.initialUser.name,
    passwordHash
  })
  await userObject.save()

  await Blog.deleteMany({})
  for(let blog of helper.initialBlogs){
    const blogObject = new Blog({ ...blog, user: userObject._id })
    await blogObject.save()
    userObject.blogs = userObject.blogs.concat(blogObject._id)
    await userObject.save()
  }
  const token = jwt.sign({
    username: userObject.username,
    id: userObject._id.toString()
  }, process.env.SECRET)
  authHeader = { authorization : `bearer ${token}` }
})

describe('when there is initially one user in db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users/')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: helper.initialUser.username,
      password: 'sekret',
      name: 'test user'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(result.body.error).toContain('expected `username` to be unique')
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      password: 'dummy',
      name: 'test user'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(result.body.error).toContain('`username` is required.')
  })

  test('creation fails with proper statuscode and message if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username:'ka',
      password: 'dummy',
      name: 'test user'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(result.body.error).toContain(' Path `username` (`'+newUser.username+'`) is shorter than the minimum allowed length (3).')
  })

  test('creation fails with proper statuscode and message if password is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username:'kai',
      password: 'sa',
      name: 'test user'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(result.body.error).toContain('Password must be at least 3 characters long')
  })

})


describe('when there are initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  test('all blogs are returned', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })


  test('a specific blog is within the returned blogs', async() => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain(helper.initialBlogs[0].title)
  })


  test('the unique identifier for a blog is called id, not _id', async() => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    })
  })

})

describe('adding a new blog', () => {

  test('a valid blog can be added', async() => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(authHeader)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(newBlog.title)
  })


  test('adding a blog fails with the proper status code 401 Unauthorized if a token is not provided', async() => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })


  test('if like is missing it defaults to zero', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(authHeader)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const savedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    expect(savedBlog.likes).toBe(0)
  })


  test('a blog with no title and url is not saved with statuscode 400', async() => {
    const newBlog = {
      author: 'Robert C. Martin'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(authHeader)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})


describe('deletion of a blog', () => {

  test('succeeds with statuscode 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(authHeader)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(blogsAtEnd).not.toContainEqual(blogToDelete)
  })

  test('fails with statuscode 401 Uanauthorized if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('fails with statuscode 400 if id is not valid', async () => {
    const invalidID = '5a3d5da59070081a82a3445'
    const blogsAtStart = await helper.blogsInDb()
    await api
      .delete(`/api/blogs/${invalidID}`)
      .set(authHeader)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })


  test('fails with statuscode 401 Uanauthorized if someone else tries to delete a blog', async () => {
    const freshUser = {
      username:'test',
      name:'test user',
      password: 'testpassword'
    }

    const passwordHash = await bcrypt.hash(freshUser.password, 10)

    const userObject = new User({
      username: freshUser.username,
      name: freshUser.name,
      passwordHash
    })
    await userObject.save()

    const freshUserToken = jwt.sign({
      username: userObject.username,
      id: userObject._id.toString()
    }, process.env.SECRET)
    const freshUserAuthHeader = { authorization : `bearer ${freshUserToken}` }

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(freshUserAuthHeader)
      .expect(401)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(result.body.error).toBe('a blog can only be deleted by its user')
  })
})


describe('editing an existing blog', () => {

  test('succeeds in updating likes of an existing blog if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]
    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send({
        title: blogToEdit.title,
        author: blogToEdit.author,
        url: blogToEdit.url,
        likes: 98,
        user: blogToEdit.user
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const editedBlog = blogsAtEnd.find(blog => blog.title === blogToEdit.title)
    expect(editedBlog.likes).not.toBe(blogToEdit.likes)
    expect(editedBlog.likes).toBe(98)
  })
})

afterAll(() => {
  mongoose.connection.close()
})