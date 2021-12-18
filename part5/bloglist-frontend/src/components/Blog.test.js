import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('tests for the <Blog/> component', () => {
  let component
  const testBlog = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      id: '61b2df8b18f494a46c314654',
      name: 'Arto Hellas',
      username: 'hellas'
    }
  }

  const addLikes = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={testBlog} addLikes={addLikes}/>
    )
  })

  test('at start url and number of likes are not displayed', () => {
    const blogHeaderDiv = component.container.querySelector('.blogHeader')
    const blogDetail = component.container.querySelector('.blogDetail')

    expect(blogHeaderDiv).not.toHaveStyle('display: none')
    expect(blogDetail).toHaveStyle('display: none')
  })

  test('url and likes are displayed when the view button is clicked', () => {
    const viewButton = component.container.querySelector('.viewButton')
    fireEvent.click(viewButton)

    const blogHeaderDiv = component.container.querySelector('.blogHeader')
    const blogDetail = component.container.querySelector('.blogDetail')

    expect(blogHeaderDiv).toHaveStyle('display: none')
    expect(blogDetail).not.toHaveStyle('display: none')
  })

  test('if like button is clicked twice the event handler is called twice', () => {
    const likeButton = component.container.querySelector('.likeButton')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(addLikes.mock.calls).toHaveLength(2)
  })
})