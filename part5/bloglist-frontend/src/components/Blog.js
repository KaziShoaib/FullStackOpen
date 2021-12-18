import React from 'react'
import { useState } from 'react'

const Blog = ({ blog, addLikes, removeBlog, showDeleteButton }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  const handleLikeButton = async () => {
    await addLikes(blog)
  }

  const handleDeleteButton = async() => {
    if(window.confirm(`Remove blog ${blog.title}`))
      await removeBlog(blog.id)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='blogHeader'>
        {blog.title}
        <b>by</b>
        <i>{blog.author}</i>
        <button onClick={toggleVisibility} className='viewButton'>view</button>
      </div>
      <div style={showWhenVisible} className='blogDetail'>
        <p>{blog.title} {blog.author}<button onClick={toggleVisibility}>hide</button></p>
        <p>{blog.url}</p>
        <p className='likeInfo'>
          likes {blog.likes}
          <button onClick={handleLikeButton} className='likeButton'>like</button>
        </p>
        <p>{blog.user.name}</p>
        <p>
          {showDeleteButton ?
            <button onClick={handleDeleteButton} className='deleteButton'>remove</button> :
            <span></span>
          }
        </p>
      </div>
    </div>
  )
}

export default Blog