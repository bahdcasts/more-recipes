import faker from 'faker'
import middleware from '../../../middleware'
import { User } from '../../../database/models'

const { registerUserValidator } = middleware

test('the registerUserValidator calls the next function if the validation is successful', async () => {
  const req = {
    body: {
      name: 'bahdcoder',
      email: faker.internet.email(),
      password: 'bahdcoder'
    }
  }

  const res = {
    sendFailureResponse() {}
  }

  const next = jest.fn()

  await registerUserValidator(req, res, next)
  expect(next).toHaveBeenCalled()
})

test('the registerUserValidator  calls the sendFailureResponse function if the validation fails', async () => {
  const req = {
    body: {
      name: 'bahd',
      password: 'bahd'
    }
  }

  const res = {
    sendFailureResponse: jest.fn()
  }

  const next = jest.fn()

  await registerUserValidator(req, res, next)

  expect(res.sendFailureResponse).toHaveBeenCalledWith({
    errors: [
      'The name must be longer than 5 characters.',
      'The password must be longer than 5 characters.',
      'The email is required.'
    ]
  }, 422)
  expect(next).toHaveBeenCalledTimes(0)
})
