let cocktailRepository = (function () {
  let cocktailList = [];
  let apiUrl =
    'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail';

  function add(drink) {
    if (typeof drink === 'object' && 'strDrink' in drink) {
      cocktailList.push(drink);
    } else {
      console.log('Drink object is incorrect');
    }
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
    loadDetails(drink).then(function () {
      console.log(drink);
    });
  }

  // function showDetails(drink) {
  //   //function that’s dedicated to adding the event listener to the newly created button
  //   console.log(drink.name);
  // }

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (json) {
        console.log(json);
        console.log(json.results);
        json.results.forEach(function (item) {
          let drinks = {
            name: item.strDrink,
            // detailsUrl: item.url
          };
          add(drinks);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
  };
})();

cocktailRepository.loadList().then(function () {
  // Now the data is loaded!
  cocktailRepository.getAll().forEach(function (drink) {
    cocktailRepository.addListItem(drink);
  });
});

// function addCocktails() {
//   for (let i = 0; i < cocktails.length; i++) {
//     cocktailRepository.add(cocktails[i]);
//   }
// }

// function printIngredients(ingredients) {
//   let ingredientsList = '';
//   for (let i = 0; ingredients[i]; i++) {
//     if (i < ingredients.length - 1) {
//       ingredientsList = ingredientsList + ingredients[i].trim() + ', ';
//     } else {
//       ingredientsList =
//         ingredientsList + 'and ' + ingredients[i].trim() + '.<br /><br />';
//     }
//   }
//   document.write('<h3>Ingredients:</h3> ' + ingredientsList);
// }

// addCocktails();

// cocktailRepository.getAll().forEach(function (drink) {
//   cocktailRepository.addListItem(drink);
// });
