import faker from 'faker'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import supertest from 'supertest'

import app from '../../../index'
import config from '../../../config'
import { User, Recipe } from '../../../database/models'

describe('The create recipe process', () => {
  test('should create recipe and return the recipe details', async () => {
    // arrange
    // create fake recipe
    const fakeRecipe = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentences(2),
      timeToCook: 40,
      imageUrl: faker.internet.url(),
      ingredients: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()]),
      procedure: JSON.stringify([faker.lorem.sentence(), faker.lorem.sentence()])
    }
    // create fake user
    const fakeUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    // generate a jwt for the user
    const user = await User.create({
      name: fakeUser.name,
      email: fakeUser.email,
      password: bcrypt.hashSync(fakeUser.password, 1)
    })

    const token = jwt.sign({ email: user.email }, config.JWT_SECRET)

    // action
    // make an authenticated request to create a recipe
    const response = await supertest(app).post('/api/v1/recipes').send({
      ...fakeRecipe,
      access_token: token
    })

    // assertion
    // make sure recipe is returned
    const { recipe } = response.body.data
    expect(response.status).toBe(201)
    expect(recipe.title).toBe(fakeRecipe.title)
    expect(recipe.description).toBe(fakeRecipe.description)
    // make sure recipe is in database
    const recipeFromDatabase = await Recipe.findById(recipe.id)
    // make sure the recipe creator is the fake user
    expect(recipeFromDatabase).toBeTruthy()
  })
})