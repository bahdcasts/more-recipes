import bcrypt from 'bcrypt'
import supertest from 'supertest'

import { User } from '../../../database/models'

import app from '../../../index'

describe('The user login', () => {
  test('the user can login and get a jwt', async () => {
    // arrange 
    await User.destroy({ where: {} })
    // setup fakeUser data
    const fakeUser = {
      name: 'bahdcoder',
      email: 'bahdcoder@gmail.com',
      password: 'password'
    }
    // create a new user 
    await User.create({
      name: fakeUser.name,
      email: fakeUser.email,
      password: bcrypt.hashSync(fakeUser.password, 1)
    }) // come back here

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
    expect(response.body.data.user.email).toBe(fakeUser.email)
  })
})