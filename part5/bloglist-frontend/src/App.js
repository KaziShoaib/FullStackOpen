import React, { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJson) {
      const userData = JSON.parse(loggedUserJson)
      setUser(userData)
      blogService.setToken(userData.token)
    }
  }, [])

  const clearNotification = () => {
    setTimeout(() => {
      setMessageType(null)
      setMessage(null)
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const userData = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(userData))
      setUser(userData)
      blogService.setToken(userData.token)
    } catch(exception) {
      setMessageType('error')
      setMessage(exception.response.data.error)
      clearNotification()
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try{
      blogFormRef.current.toggleVisibility()
      const savedBlog = await blogService.create(blogObject)
      setMessageType('success')
      setMessage(`a new blog ${savedBlog.title} by ${savedBlog.author} added`)
      const correctedSavedBlog = {
        ...savedBlog,
        user: {
          id: savedBlog.user.toString(),
          name: user.name,
          username: user.username
        }
      }
      setBlogs(blogs.concat(correctedSavedBlog))
      clearNotification()
    } catch(exception){
      setMessageType('error')
      setMessage(exception.response.data.error)
      clearNotification()
    }
  }

  const addLikes = async (blogObject) => {
    const modifiedBlog = {
      title: blogObject.title,
      likes: blogObject.likes+1,
      author: blogObject.author,
      url: blogObject.url,
      user: blogObject.user.id
    }
    const editedBlog = await blogService.edit(blogObject.id, modifiedBlog)
    setBlogs(blogs.map(blog => blog.id === editedBlog.id ? { ...blog, likes: editedBlog.likes } : blog))
  }

  const removeBlog = async (id) => {
    try{
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setMessageType('success')
      setMessage('successfully deleted blog')
      clearNotification()
    } catch(exception) {
      setMessageType('error')
      setMessage(exception.response.data.error)
      clearNotification()
    }
  }

  if(user === null)
    return (
      <div>
        <Notification message={message} messageType={messageType}/>
        <LoginForm handleLogin={handleLogin} />
      </div>
    )

  return (
    <div>
      <Notification message={message} messageType={messageType}/>
      {user === null ?
        <LoginForm handleLogin={handleLogin} /> :
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in <button onClick={handleLogout} className='logoutButton'>logout</button>
          </p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={createBlog}/>
          </Togglable>

          {blogs.concat().sort((a, b) => b.likes-a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} addLikes={addLikes} removeBlog={removeBlog} showDeleteButton={user.username === blog.user.username}/>
          )}
        </div>
      }
    </div>
  )
}

export default App