import jwt from 'jsonwebtoken'
import config from '../../../config'
import middleware from '../../../middleware'
import { User } from '../../../database/models'

const { auth } = middleware

describe('The auth middleware', () => {
  test('should call next if user is authenticated', async () => {
    await User.destroy({ where: {} })
    const user = await User.create({
      name: 'bahdcoder',
      email: 'bahdcoder@gmail.com',
      password: 'password'
    })
    const req = {
      body: {
        access_token: jwt.sign({ email: user.email }, config.JWT_SECRET)
      }
    }

    const res = {}

    const next = jest.fn()

    await auth(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.authUser).toBeDefined()
    expect(req.authUserObj).toBeDefined()
  })
  test('should call sendFailureResponse if user is not authenticated', async () => {
    const req = {
      body: {},
      query: {},
      headers: {}
    }

    const res = {
      sendFailureResponse: jest.fn()
    }

    const next = jest.fn()

    await auth(req, res, next)

    expect(res.sendFailureResponse).toHaveBeenCalledWith({
      message: "Unauthenticated."
    }, 401)
    expect(next).toHaveBeenCalledTimes(0)
  })
  test('should throw an error if user is not found', async () => {
    const req = {
      body: {
        access_token: jwt.sign({ email: 'bahdcodernotfiund@email.com' }, config.JWT_SECRET)
      }
    }

    const res = {
      sendFailureResponse: jest.fn()
    }

    const next = jest.fn()

    await auth(req, res, next)

    expect(res.sendFailureResponse).toHaveBeenCalledWith({
      message: 'Unauthenticated.'
    }, 401)
  })
})
