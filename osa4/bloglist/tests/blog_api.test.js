const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
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

beforeEach(async () => {
  await Blog.deleteMany()
  for await (const blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned', async () => {
  const { headers, status, body } = await api.get('/api/blogs/')

  expect(headers['content-type']).toMatch(/application\/json/)
  expect(status).toBe(200)
  expect(body.length).toBe(initialBlogs.length)
})

test('blogs have id', async () => {
  const { body } = await api.get('/api/blogs/')

  body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('new blog can be added', async () => {
  const expectedTitle = 'New blog to be added'
  const newBlog = {
    title: expectedTitle,
    author: 'Test author',
    url: 'http://localhost:3000',
    likes: 4
  }

  const postResponse = await api.post('/api/blogs')
    .send(newBlog)

  expect(postResponse.headers['content-type']).toMatch(/application\/json/)
  expect(postResponse.status).toBe(201)

  const getResponse = await api.get('/api/blogs')
  const titles = getResponse.body.map(b => b.title)

  expect(getResponse.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(expectedTitle)
})

test('likes default to 0 for new blogs', async () => {
  const newBlog = {
    title: 'New blog to be added',
    author: 'Test author',
    url: 'http://localhost:3000'
  }

  const { status, body } = await api.post('/api/blogs')
    .send(newBlog)
    
  expect(status).toBe(201)
  expect(body.likes).toBe(0)
})

test('title is required for new blog', async () => {
  const newBlogWithoutTitle = {
    author: 'Test author',
    url: 'http://localhost:3000',
    likes: 4
  }

  const { status } = await api.post('/api/blogs')
    .send(newBlogWithoutTitle)

  expect(status).toBe(400)
})

test('url is required for new blog', async () => {
  const newBlogWithoutUrl = {
    title: 'New blog to be added',
    author: 'Test author',
    likes: 4
  }

  const { status } = await api.post('/api/blogs')
    .send(newBlogWithoutUrl)

  expect(status).toBe(400)
})

test('blog can be deleted', async () => {
  const blogToBeRemoved = initialBlogs[0]._id

  const deleteResponse = await api.delete(`/api/blogs/${blogToBeRemoved}`)
  
  expect(deleteResponse.status).toBe(204)

  const getResponse = await api.get('/api/blogs')
  const ids = getResponse.body.map(b => b.id)

  expect(getResponse.body).toHaveLength(initialBlogs.length - 1)
  expect(ids).not.toContain(blogToBeRemoved)
})

afterAll(() => {
  mongoose.connection.close()
})