let cocktailRepository = (function () {
  let cocktailCategories = [];
  let apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';

  function add(category) {
    cocktailCategories.push(category);
  }

  function loadCategoryList() {
    return fetch(apiUrl) // fetch returns a Promise
      .then(function (response) {
        //same thing as last 2 lines of fetchDrinksByCategory function
        return response.json();
      })
      .then(function (json) {
        json.drinks.forEach(function (item) {
          // this anonymous function is the callback of forEach function, item is the parameter, item is the element of the json.drinks array which is an object
          add(item.strCategory);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function getAll() {
    return cocktailCategories;
  }

  function fetchDetailsByDrinkName(name) {
    return fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
    )
      .then((response) => response.json())
      .then((json) => json.drinks);
  }

  function addDrinkListItem(drink) {
    let drinkItem = document.createElement('li');
    let drinkButton = document.createElement('button');
    let drinksButtons = document.querySelector('.cocktail-drinks__buttons');

    drinkButton.setAttribute('data-toggle', 'modal');
    drinkButton.setAttribute('data-target', '#modal-container');

    drinkButton.innerText = drink.strDrink;
    drinkItem.appendChild(drinkButton);
    drinksButtons.appendChild(drinkItem);

    drinkButton.addEventListener('click', function () {
      let drinkName = drink.strDrink;
      fetchDetailsByDrinkName(drinkName).then((response) => {
        showModal(response);
      });
    });
  }

  function fetchDrinksByCategory(category) {
    return fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
    )
      .then((response) => response.json())
      .then((json) => json.drinks);
  }

  function addCategoryListItem(category) {
    let element = document.querySelector('.cocktail-categories');
    let categoryListItem = document.createElement('li');
    let categoryButton = document.createElement('button');
    categoryButton.innerText = category;

    categoryButton.addEventListener('click', function () {
      fetchDrinksByCategory(category).then((drinks) => {
        document.querySelector('.cocktail-drinks__buttons').innerHTML = ''; // clear all the drinks, otherwise it would keep appending the drinks of the clicked category at the end
        drinks.forEach((drink) => {
          // you can inspect api response under Network tab > XHR > Response
          addDrinkListItem(drink);
        });
      });
    });
    categoryListItem.appendChild(categoryButton); //append button to list item
    element.appendChild(categoryListItem); //append list item to parent
  }

  function getIngredients(selectedDrink) {
    let recipeArray = [];

    for (let i = 1; i <= 15; i++) {
      let ingredientString = 'strIngredient' + i;
      let measurementString = 'strMeasure' + i;
      let ingredientValue = selectedDrink[ingredientString];
      let measurementValue = selectedDrink[measurementString];

      if (ingredientValue === null && measurementValue === null) {
        continue;
      }
      let recipe = {
        ingredient: ingredientValue,
        measurement: measurementValue,
      };
      recipeArray.push(recipe);
    }
    return recipeArray;
  }

  function makeIngredientsListElement(selectedDrink) {
    let recipe = getIngredients(selectedDrink);
    let IngredientsListElement = document.createElement('ul');
    IngredientsListElement.classList.add('modal__ingredients');

    recipe.forEach(function (element) {
      let IngredientsElement = document.createElement('li');
      IngredientsElement.innerText =
        element.ingredient + ': ' + element.measurement;

      IngredientsListElement.appendChild(IngredientsElement);
    });
    return IngredientsListElement;
  }

  function showModal(response) {
    let selectedDrink = response[0];

    let modalBody = $('.modal-body');
    let modalTitle = $('.modal-title');
    modalTitle.empty();
    modalBody.empty();

    let title = $('<h1>' + selectedDrink.strDrink + '</h1>');
    let instructionsTitle = '<h3>Instructions:</h3>';
    let instructions = $('<p>' + selectedDrink.strInstructions + '</p>');
    let image = $('<img class="modal-img">');
    image.attr('src', selectedDrink.strDrinkThumb);
    let ingredientsTitle = $('<h3>Ingredients:</h3>');
    let ingredients = makeIngredientsListElement(selectedDrink);

    modalTitle.append(title);
    modalBody.append(instructionsTitle);
    modalBody.append(instructions);
    modalBody.append(ingredientsTitle);
    modalBody.append(ingredients);
    modalBody.append(image);
  }

  return {
    getAll: getAll,
    loadCategoryList: loadCategoryList,
    addCategoryListItem: addCategoryListItem,
  };
})();

cocktailRepository.loadCategoryList().then(function () {
  // Now the data is loaded!
  console.log('Data loaded! now getAll()');
  cocktailRepository.getAll().forEach(function (category) {
    cocktailRepository.addCategoryListItem(category);
  });
});
