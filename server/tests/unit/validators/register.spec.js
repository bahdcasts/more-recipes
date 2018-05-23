import validators from '../../../validators'

const { RegisterUserValidator } = validators

describe('The RegisterUserValidator class', () => {
  describe('The validateName function ', () => {
    test('The validateName function adds a required error to the errors array if name is not provided', () => {
      // ARRANGE
      const validator = new RegisterUserValidator({
        email: 'bahdcoder@gmail.com'
      })

      // ACTION
      validator.validateName()

      // ASSERTION
      const { errors } = validator
      expect(errors).toEqual([
        'The name is required.'
      ])
    })
    test('adds an error if name is less than 5 characters', () => {
      // ARRANGE
      const validator = new RegisterUserValidator({
        name: 'bahd'
      })
      // ACTION

      validator.validateName()

      // ASSERTION
      expect(validator.errors).toEqual([
        'The name must be longer than 5 characters.'
      ])
    })
  })
  describe('The validatePassword function ', () => {
    test('adds a required error to the errors array if password is not provided', () => {
      // ARRANGE
      const validator = new RegisterUserValidator({
        email: 'bahdcoder@gmail.com'
      })

      // ACTION
      validator.validatePassword()

      // ASSERTION
      const { errors } = validator
      expect(errors).toEqual([
        'The password is required.'
      ])
    })
    test('adds an error if password is less than 6 characters', () => {
      // ARRANGE
      const validator = new RegisterUserValidator({
        password: 'bahd'
      })
      // ACTION

      validator.validatePassword()

      // ASSERTION
      expect(validator.errors).toEqual([
        'The password must be longer than 5 characters.'
      ])
    })
  })
})

