import faker from 'faker'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import supertest from 'supertest'

import app from '../../../index'
import config from '../../../config'
import { generateUser, generateRecipe } from '../../utils/generate'
import { User, Recipe } from '../../../database/models'

describe('The getRecipe endpoint', () => {
  test('can get a single recipe by id', async () => {
    // arrange
    // create a recipe
    const fakeRecipe = generateRecipe()
    const recipe = await Recipe.create(fakeRecipe)

    // action
    // get the recipe 
    const response = await supertest(app).get(`/api/v1/recipes/${recipe.id}`)

    // assertions
    // expect the status to be 200
    expect(response.status).toBe(200)
    // expect response to contain recipe data
    expect(response.body.data.recipe.title).toBe(fakeRecipe.title)
  })

  test('returns a 404 if recipe is not found', async () => {
    // arrange 
    // create fake id
    const FAKE_ID = 'fake_id'

    // action
    // make GET request with fake id
    const response = await supertest(app).get(`/api/v1/recipes/${FAKE_ID}`)

    // assertion
    // assert 404 is returned from server.
    expect(response.status).toBe(404)
    expect(response.body.data.message).toBe('Recipe not found.')
  })
})
