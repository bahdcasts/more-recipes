import middleware from '../../../middleware'

const { registerUserValidator } = middleware

test('the registerUserValidator calls the next function if the validation is successful', async () => {
  const req = {
    body: {
      name: 'bahdcoder',
      email: 'bahdcoder@gmail.com',
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

