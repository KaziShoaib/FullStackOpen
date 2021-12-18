import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('tests for the <BlogForm/> component', () => {
  test('event handler is called with proper values', async () => {
    const createBlog = jest.fn()
    const component = render (
      <BlogForm createBlog={createBlog} />
    )
    const form = component.container.querySelector('form')
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, {
      target: { value: 'React patterns' }
    })
    fireEvent.change(author, {
      target : { value: 'Michael Chan' }
    })
    fireEvent.change(url, {
      target : { value: 'https://reactpatterns.com/' }
    })
    await waitFor(() => fireEvent.submit(form))
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('React patterns')
    expect(createBlog.mock.calls[0][0].author).toBe('Michael Chan')
    expect(createBlog.mock.calls[0][0].url).toBe('https://reactpatterns.com/')
  })
})


