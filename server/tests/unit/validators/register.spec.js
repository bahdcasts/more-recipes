import validators from '../../../validators'

const { RegisterUserValidator } = validators

describe('The RegisterUserValidator class', () => {
  describe('The validateName function ', () => {
    test('The validateName function adds a required error to the errors array if name is not provided', () => {
      const validator = new RegisterUserValidator({
        email: 'bahdcoder@gmail.com'
      })

      validator.validateName()

      const errors = validator.errors
      expect(errors).toEqual([
        'The name is required.'
      ])
    })
  })
})

