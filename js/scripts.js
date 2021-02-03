let cocktailRepository = (function () {
  let cocktailList = [];

  function add(drink) {
    cocktailList.push(drink);
  }

  function getAll() {
    return cocktailList;
  }

  return {
    add: add,
    getAll: getAll,
  };
})();

let cocktails = [
  {
    name: "Hunter's Moon",
    category: 'Cocktail',
    glass: 'Balloon Glass',
    // prettier-ignore
    ingredients: ['Vermouth','Maraschino Cherry','Sugar Syrup','Lemonade','Blackberries',],
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
    // prettier-ignore
    ingredients: ['Water','Sugar','Cloves','Cinnamon','Lemon peel','Red wine','Brandy',],
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

cocktailRepository.add(cocktails);
console.log(cocktailRepository.getAll());

cocktailRepository.forEach(function (drink) {
  document.write(
    '<h3>Cocktail Name:</h3> ' +
      drink.name +
      '<br /><br /><h3>Category:</h3> ' +
      drink.category +
      '<br /><br /><h3>Ingredients:</h3> ' +
      drink.ingredients +
      '<br /><br />'
  );
});

// FOR-LOOP function
// function printCocktails() {
//   let container = '<div class="container">';
//   document.write(container);
//   for (let i = 0; cocktails[i]; i++) {
//     let text =
//       '<h3>Cocktail name:</h3> ' +
//       cocktails[i].name +
//       '<br /> <h3>Category: </h3>' +
//       cocktails[i].category +
//       ' <br />';
//     document.write(text + '<h3>Ingredients:</h3> ');
//     let drinkIngredients = '';

//     for (let j = 0; j < cocktails[i].ingredients.length; j++) {
//       if (j < cocktails[i].ingredients.length - 1) {
//         /*check if it is NOT the last word, only have commas if another word follows*/
//         drinkIngredients =
//           drinkIngredients + cocktails[i].ingredients[j].trim() + ', ';
//       } else {
//         drinkIngredients =
//           drinkIngredients +
//           'and ' +
//           cocktails[i].ingredients[j].trim() +
//           '.<br /><br />';
//       }
//     }
//     document.write(drinkIngredients);
//   }
//   document.write('</div>');
// }
// printCocktails();
