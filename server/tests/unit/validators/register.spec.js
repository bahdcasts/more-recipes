import faker from 'faker'
import { User } from '../../../database/models'
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
  describe('The validateEmail function', () => {
    test('adds a required error if the email is not provided', async () => {
      const validator = new RegisterUserValidator({
        name: 'bahdcoder'
      })

      await validator.validateEmail()

      expect(validator.errors).toEqual([
        'The email is required.'
      ])
    })
    test('adds an error if email is invalid', async () => {
      const validator = new RegisterUserValidator({
        email: 'bahdcoder@masd'
      })

      await validator.validateEmail()

      expect(validator.errors).toEqual([
        'The email must be a valid email address.'
      ])
    })

    test('adds an email taken error if user already exists with that email', async () => {
      // CREATE NEW USER WITH THIS EMAIL
      const user = await User.create({
        name: 'bahdcoder',
        email: faker.internet.email(),
        password: 'password'
      })

      // INITIALIZE OUR VALIDATOR
      const validator = new RegisterUserValidator({
        email: user.email
      })

      await validator.validateEmail()

      expect(validator.errors).toEqual([
        'A user with this email already exists.'
      ])
    })
  })
  describe('The isValid function' , () => {
    test('returns true if validation passes', async () => {
      // arrange
      const validator = new RegisterUserValidator({
        name: 'bahdcoder',
        email: faker.internet.email(),
        password: 'password'
      })

      // action
      const result = await validator.isValid()

      // assertion
      expect(result).toBe(true)
    })
    test('returns false for invalid data', async () => {
      const validator = new RegisterUserValidator({
        name: 'bahd'
      })

      const result = await validator.isValid()
      expect(result).toBe(false)
    })

    test(' the validateName, validateEmail, validatePassword functions are called in the isValid function', async () => {
      const validator = new RegisterUserValidator({
        name: 'bahd',
        password: 'pass',
        email: 'bahdcoder@gmail'
      })

      jest.spyOn(validator, 'validateName')
      jest.spyOn(validator, 'validateEmail')
      jest.spyOn(validator, 'validatePassword')      

      await validator.isValid()

      expect(validator.validateName).toHaveBeenCalled()
      expect(validator.validateEmail).toHaveBeenCalled()
      expect(validator.validatePassword).toHaveBeenCalled()
    })
  })
})

