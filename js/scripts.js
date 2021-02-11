//what parameters can I use in the promises?
//how to display image on page?

let cocktailRepository = (function () {
  let cocktailList = [];
  let apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';

  function add(drink) {
    //if (typeof drink === 'object' && 'strDrink' in drink) { ---Why doesn't this work?
    if (typeof drink === 'object') {
      cocktailList.push(drink);
    } else {
      console.log('Drink object is incorrect');
    }
  }

  function getAll() {
    return cocktailList;
  }

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.drinks.forEach(function (item) {
          let drinks = {
            category: item.strCategory,
          };
          add(drinks);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function addListItem(drink) {
    let element = document.querySelector('.cocktail-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = drink.category;
    button.classList.add('drink-info-button');
    button.addEventListener('click', function () {
      showDetails(drink);
    }); //Event Listener
    listItem.appendChild(button); //append button to list item
    element.appendChild(listItem); //append list item to parent
    showDetails(drink); //call new function inside addListItem() after button is appended to DOM
  }

  function loadDetails(item) {
    // function loadDetails(drink) { -- why doesn't it work when i change item to drink
    let selectedCategory = item.category;
    selectedCategory = selectedCategory.replace(/\s+/g, '_');
    let categoryUrl =
      'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=' +
      selectedCategory;
    return fetch(categoryUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.drinks.forEach(function (details) {
          item.name = details.strDrink;
          item.imageUrl = details.strDrinkThumb + '/preview';
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  //! Need help assigning names to multiple drinks?
  function loadMoreDetails(item) {
    let selectedDrink = item.name;
    selectedDrink = selectedDrink.replace(/\s+/g, '_');
    let drinkUrl =
      'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' +
      selectedDrink;
    return fetch(drinkUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.glass = details.strGlass;
        console.log('--' + details.strGlass); //Why undefined?
        item.instructions = details.strInstructions;
        // item.ingredient = details.strIngredient1; add for-loop to iterate thru object?
        item.isAlcoholic = details.strAlcoholic;
        // item.measure = details.strMeasure1; add for-loop to iterate thru object?
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showDetails(drink) {
    //function that’s dedicated to adding the event listener to the newly created button
    loadDetails(drink).then(function () {
      loadMoreDetails(drink);
    });
    console.log(drink);
  }

  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    addListItem: addListItem,
    loadDetails: loadDetails,
    loadMoreDetails: loadMoreDetails,
    showDetails: showDetails,
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
