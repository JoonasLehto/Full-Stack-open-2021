const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    _id: '621d14620cc8071d9b3a39da',
    username: 'User1',
    name: 'User1',
    passwordHash: '$2b$10$AUrs2kz8un5q.TDDGSs49.Ms/Wd6WiHBMPuFx71LT3o2HviSYRzWy',
    __v: 0
  }
]

beforeEach(async () => {
  await User.deleteMany()
  for await (const user of initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
})

test('user with no password is not added', async () => {
  const newUser = {
    username: 'User2',
    name: 'User2'
  }

  const { headers, status, body } = await api.post('/api/users')
    .send(newUser)

  expect(headers['content-type']).toMatch(/application\/json/)
  expect(status).toBe(400)
  expect(body.error).toBeDefined()
})

test('user with too short password is not added', async () => {
  const newUser = {
    username: 'User2',
    name: 'User2',
    password: '12'
  }

  const { headers, status, body } = await api.post('/api/users')
    .send(newUser)

  expect(headers['content-type']).toMatch(/application\/json/)
  expect(status).toBe(400)
  expect(body.error).toBeDefined()
})

test('user with duplicate username is not added', async () => {
  const newUser = {
    username: 'User1',
    name: 'User1',
    password: '12345'
  }

  const { headers, status, body } = await api.post('/api/users')
    .send(newUser)

  expect(headers['content-type']).toMatch(/application\/json/)
  expect(status).toBe(400)
  expect(body.error).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})