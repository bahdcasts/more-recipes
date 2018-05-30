import supertest from 'supertest'

import app from '../../../index'

describe('The user sign up tests', () => {
  test('should register a new user', async () => {
    const response = await supertest(app).get('/api/v1/recipes')

    console.log(response.body)
  })
})
