import supertest from 'supertest'
import { User } from '../../../database/models'

import app from '../../../index'

describe('The user sign up tests', () => {
  test('should register a new user', async () => {
    // arrange 
    await User.destroy({ where: {} })
    // get some fake user data
    const fakeUser = {
      name: 'bahdcoder',
      email: 'bahdcoder@gmail.com',
      password: 'password'
    }

    // action
    const response = await supertest(app).post('/api/v1/users/signup').send(fakeUser)
    // make post request to sign up

    // assertion
    // 1. the response has the user data
    expect(response.status).toBe(200)
    expect(response.body.data.user.name).toBe(fakeUser.name)
    expect(response.body.data.user.email).toBe(fakeUser.email)
    expect(response.body.data.access_token).toBeTruthy()    
    // 2. the database has a user with the credentials we signed up with.
    const userFromDatabase = await User.find({ where: { email: fakeUser.email } })
    expect(userFromDatabase).toBeTruthy()
  })
})
