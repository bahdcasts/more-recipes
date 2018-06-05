import faker from 'faker'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import supertest from 'supertest'

import app from '../../../index'
import config from '../../../config'
import { generateUser, generateRecipe } from '../../utils/generate'
import { User, Recipe } from '../../../database/models'

describe('The delete recipe endpoint', () => {
  test('deletes recipe from database and returns message', async () => {
    // arrange
    // fake user, and create a recipe for this user
    const { token, user } = await generateUser();
    const fakeRecipe = await generateRecipe();

    const recipe = await Recipe.create({
      ...fakeRecipe,
      userId: user.id
    });

    // action
    // make  DELETE request to delete this recipe
    const response = await supertest(app).delete(`/api/v1/recipes/${recipe.id}`).send({
      access_token: token
    })

    // assertion
    // make sure response from server is recipe deleted.
    expect(response.status).toBe(200);
    expect(response.body.data.message).toBe('Recipe deleted.')
    // make sure the recipe is no longer in the database.
    const recipesFromDatabase = await Recipe.findAll({ where: { id: recipe.id } })
    expect(recipesFromDatabase.length).toBe(0)
  })
})
