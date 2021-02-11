let cocktailRepository = (function () {
  let cocktailList = [];

  function add(drink) {
    cocktailList.push(drink);
  }

  function getAll() {
    return cocktailList;
  }

  function addListItem(drink) {
    let element = document.querySelector('.cocktail-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = drink.name;
    button.classList.add('drink-info-button');
    button.addEventListener('click', function () {
      showDetails(drink);
    }); //Event Listener
    listItem.appendChild(button); //append button to list item
    element.appendChild(listItem); //append list item to parent
    showDetails(drink); //call new function inside addListItem() after button is appended to DOM
  }

  function showDetails(drink) {
    //function that’s dedicated to adding the event listener to the newly created button
    console.log(drink.name);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
  };
})();

let cocktails = [
  {
    name: "Hunter's Moon",
    category: 'Cocktail',
    glass: 'Balloon Glass',
    ingredients: [
      'Vermouth',
      'Maraschino Cherry',
      'Sugar Syrup',
      'Lemonade',
      'Blackberries',
    ],
    instructions:
      'Put the Bombay Sapphire, Martini Bianco, sugar syrup & blackberries in a cocktail shaker with lots of ice and shake vigorously before pouring into a balloon glass, topping up with lemonade and garnishing with a wedge of orange.',
  },
  {
    name: 'Brigadier',
    category: 'Cocktail',
    glass: 'Coupe glass',
    ingredients: ['Hot Chocolate', 'Green Chartreuse', 'Cherry Heering'],
    instructions: 'Mix ingredients in a warmed mug and stir.',
  },
  {
    name: 'Mulled Wine',
    category: 'Punch / Party Drink',
    glass: 'Collins Glass',
    ingredients: [
      'Water',
      'Sugar',
      'Cloves',
      'Cinnamon',
      'Lemon peel',
      'Red wine',
      'Brandy',
    ],
    instructions:
      'Simmer 3 cups water with, sugar, cloves, cinnamon sticks, and lemon peel in a stainless steel pot for 10 minutes. Add wine heat to a "coffee temperature" (DO NOT BOIL) then add the brandy.',
  },
  {
    name: 'Hot Creamy Bush',
    category: ' Coffee  / Tea ',
    glass: ' Irish coffee cup ',
    ingredients: [' Irish whiskey ', ' Baileys irish cream ', ' Coffee '],
    instructions: ' Combine all ingredients in glass ',
  },
  {
    name: 'Applecar',
    category: 'Ordinary Drink',
    glass: 'Cocktail glass',
    ingredients: ['Applejack', 'Triple sec', 'Lemon juice'],
    instructions:
      'Shake all ingredients with ice, strain into a cocktail glass, and serve.',
  },
];

function addCocktails() {
  for (let i = 0; i < cocktails.length; i++) {
    cocktailRepository.add(cocktails[i]);
  }
}

function printIngredients(ingredients) {
  let ingredientsList = '';
  for (let i = 0; ingredients[i]; i++) {
    if (i < ingredients.length - 1) {
      ingredientsList = ingredientsList + ingredients[i].trim() + ', ';
    } else {
      ingredientsList =
        ingredientsList + 'and ' + ingredients[i].trim() + '.<br /><br />';
    }
  }
  document.write('<h3>Ingredients:</h3> ' + ingredientsList);
}

addCocktails();

cocktailRepository.getAll().forEach(function (drink) {
  cocktailRepository.addListItem(drink);
});
