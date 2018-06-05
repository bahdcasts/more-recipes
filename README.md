# MORE-RECIPES
A platform for users to share awesome and exciting recipe ideas they have invented or learnt. 
****
## Introduction
More-Recipes provides a platform for users to share the awesome and exciting  recipe ideas they have invented or learnt.  Suppose a user comes up with a recipe,  he/she can post it on More-Recipes and  get feedback in form of reviews and votes from other users who explore that recipe. Users can also keep a list of their favorite recipes on the application.
## Application features

* User signup and signin pages.
* A recipe listing or catalog page that allows viewers to search for recipes. It also includes a view/section showing popular (most favorited) recipes.
* A page that shows details of a recipe, allows users upvote/downvote/favorite recipes, and see any reviews. Authenticated users should be able to provide reviews on recipes.
* A page that shows the favorite recipes of an authenticated user
* A page where an authenticated user can see his/her profile
* A page where an authenticated user can do the following: 
  - Retrieve recipes from the catalog
  - Add a recipe to the catalog
  - Modify a recipe in the catalog, including upvoting, downvoting, favoriting e.t.c
  - Delete a recipe from the catalog
  - Retrieve favorited recipes from the catalog
  - Add a review for a recipe
  - Retrieve recipes with the most upvotes

## Technology Stack
* NodeJS
* Express
* Sequelize ORM
* Postgresql Relational Database
* Redis key-value store

## Getting started
* Have nodeJS installed locally, with a postgres database.
* Clone the repository locally:
  ```sh
  $ git clone https://github.com/bahdcasts/more-recipes && cd more-recipes
  ```
* Install all required dependencies
  ```sh
  $ npm install
  ```
* Rename `.env.example` file to `.env`
* Setup required configurations as specified in the new .env file. Eg. Database configs, JWT secret
* Start the server api application with: 
  ```sh
  $ npm run start:dev
  ```
* Server should be up and running on port `5678`
* Build the application for production with: 
  ```sh
  $ npm run build
  ```

## Using the application

### The server api
The server api uses the [Jsend Response Standard](http://labs.omniti.com/labs/jsend)
### The API documentation
Visit the `/api-docs` route to view the api documentation created with swagger.
#### THE ROUTES
All api routes are prefixed with `/api/v1`

* POST `/users/signup` for creation of new account. Required fields are:
  * `name` Username containing alphabets, mininmum of five characters
  * `email` A valid email address of the new user, unique to the app database
  * `password` Password mininmum character length of five

* POST `/users/signin` for logging in to the application. Required fields are:
  * `email` Username of registered user
  * `password` Password of registered user

* GET `/recipes/<recipeId>` for getting a single recipe
* POST `/recipes` for creating new recipes posts. Required fields are:
  * `title` Name of the recipe
  * `ingredients` Ingredients for preparing the recipe (must be a valid json serialized array) 
  * `timeToCook` Length of time for preparing this recipe (must be a number) 
  * `procedure` Step by step guide on how recipe is prepared (must be a valid json serialized array) 
  * `imageUrl` Url of recipe image (must be a valid url)
  
* GET `/recipes` for viewing all the posted recipes in the application

* GET `/recipes?sort=mostUpvoted` sort results by upvotes
* GET `/recipes?sort=mostFavorited` sort results by most favorited
* GET `/recipes?sort=date` sort results by lastly created


* GET `/recipes?query=<keyword>` for searching recipes in database with title matching query keyword

* PUT `/recipes/<recipeId>` update the details of a recipe. Fields that can be modified:
  * `title`
  * `timeToCook`
  * `description`
  * `ingredients`
  * `procedure`

* DELETE `/recipes/<recipeId>` to delete a recipe.

* GET `/users/<userId>recipes` to get all recipes owned by a user

* POST `/recipes/<recipeId>/upvote` to upvote a recipe.

* POST `/recipes/<recipeId>/downvote` to downvote a recipe.

* POST `/recipes/<recipeId>/reviews` add a review to a recipe

* POST `/users/<recipeId>/favorites` favorite a recipe for a user

* POST `/users/<recipeId>/favorites` get all favorite recipes for a user

#### RUNNING TESTS 

```sh
  $ npm run test
```

#### How To Contribute
* Fork the repository
* Create a feature branch with a feature.md file
* Write tests and make them pass
* Open a pull request
