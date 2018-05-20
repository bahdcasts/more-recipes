module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Recipe', [{
    title: 'Vegetable Soup',
    description: 'This soup is a very popular Yoruba dish.'
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Recipe', null, {})
};
