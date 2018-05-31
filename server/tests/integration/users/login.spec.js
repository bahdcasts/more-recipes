import bcrypt from 'bcrypt'
import supertest from 'supertest'

import { User } from '../../../database/models'
import { generateUser } from '../../utils/generate'

import app from '../../../index'

describe('The user login', () => {
  test('the user can login and get a jwt', async () => {
    // arrange 
    const { user, token, fakeUser } = await generateUser()

    // action
    // make POST request to login
    const response = await supertest(app).post('/api/v1/users/signin').send({
      email: fakeUser.email,
      password: fakeUser.password
    })

    // assertion
    expect(response.status).toBe(200)
    // assert the response from server contains jwt, and user data
    expect(response.body.data.access_token).toBeTruthy()
    expect(response.body.data.user.email).toBe(user.email)
  })
})