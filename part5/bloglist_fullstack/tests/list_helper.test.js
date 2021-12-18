const listHelper = require('../utils/list_helper')

const emptyList = []
const oneBlogList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }
]
const multipleBlogList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = emptyList

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})


describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = emptyList
    expect(listHelper.totalLikes(blogs)).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const blogs = oneBlogList
    expect(listHelper.totalLikes(blogs)).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = multipleBlogList
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})


describe('favourite blog', () => {

  test('of empty list is an empty object', () => {
    const blogs = emptyList
    expect(listHelper.favouriteBlog(blogs)).toEqual({})
  })

  test('when list has only one blog that blog is favourite', () => {
    const blogs = oneBlogList
    const favourite = {
      title: blogs[0].title,
      author: blogs[0].author,
      likes:blogs[0].likes
    }
    expect(listHelper.favouriteBlog(blogs)).toEqual(favourite)
  })

  test('of bigger list is computed right', () => {
    const blogs = multipleBlogList
    const favourite = {
      title: blogs[2].title,
      author: blogs[2].author,
      likes:blogs[2].likes
    }
    expect(listHelper.favouriteBlog(blogs)).toEqual(favourite)
  })
})


describe('most blog', () => {
  test('of an empty list is an empty object', () => {
    const blogs = emptyList
    expect(listHelper.mostBlogs(blogs)).toEqual({})
  })

  test('when the list has only one blog the author of that blog has most blog', () => {
    const blogs = oneBlogList
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('of bigger list is computed correctly', () => {
    const blogs = multipleBlogList
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})


describe('most likes', () => {
  test('of an empty list is an empty object', () => {
    const blogs = emptyList
    expect(listHelper.mostLikes(blogs)).toEqual({})
  })

  test('when the list has only one blog the author of that blog has most likes', () => {
    const blogs = oneBlogList
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('of bigger list is computed correctly', () => {
    const blogs = multipleBlogList
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})