const _ = require('lodash')


const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes
  return blogs.reduce(reducer, 0)
}


const favouriteBlog = (blogs) => {
  if(blogs.length === 0)
    return {}
  const blog = _.maxBy(blogs, 'likes')
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}


const mostBlogs = (blogs) => {
  if(blogs.length === 0)
    return {}
  const authors = blogs.map(blog => blog.author)
  const countObject = _.countBy(authors)
  let countArray = []
  Object.keys(countObject).forEach(key => {
    countArray = countArray.concat({
      author: key,
      blogs: countObject[key]
    })
  })
  return _.maxBy(countArray, 'blogs')
}


const mostLikes = (blogs) => {
  if(blogs.length === 0)
    return {}
  let likeArray = []
  blogs.map(blog => {
    const index = _.findIndex(likeArray, o => o.author === blog.author)
    if(index === -1) {
      likeArray.push({
        author: blog.author,
        likes: blog.likes
      })
    }
    else {
      likeArray[index].likes += blog.likes
    }
  })
  return _.maxBy(likeArray, 'likes')
}


module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}