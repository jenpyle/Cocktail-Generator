//Mobile view is not centered

let cocktailRepository = (function () {
  let filteredOptionsObj = {};

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
    IngredientsListElement.classList.add('list-group');
    IngredientsListElement.classList.add('modal__ingredients');

    recipe.forEach(function (element) {
      let IngredientsElement = document.createElement('li');
      IngredientsElement.classList.add('group-list-item');
      IngredientsElement.innerText = element.ingredient + ': ' + element.measurement;

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

  function fetchDetailsByDrinkName(name) {
    return fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
      .then((response) => response.json())
      .then((json) => json.drinks);
  }

  function addDrinkListItem(drink) {
    let drinkItem = document.createElement('li');
    drinkItem.classList.add('group-list-item');
    let drinkButton = document.createElement('button');
    drinkButton.classList.add('btn');
    let drinksButtons = document.querySelector('.drinks');

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

  function fetchDrinksByFilter(filterLetter, itemValue) {
    return fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?${filterLetter}=${itemValue}`)
      .then((response) => response.json())
      .then((json) => json.drinks);
  }

  function addFilteredListItem(filterLetter, itemValue) {
    let element = document.querySelector('.filtered-options');
    let filteredListItem = document.createElement('li');
    filteredListItem.classList.add('group-list-item');
    let itemButton = document.createElement('button');
    itemButton.classList.add('btn');
    itemButton.innerText = itemValue;

    itemButton.addEventListener('click', function () {
      fetchDrinksByFilter(filterLetter, itemValue).then((drinks) => {
        document.querySelector('.drinks').innerHTML = ''; // clear all the drinks, otherwise it would keep appending the drinks of the clicked category at the end
        drinks.forEach((drink) => {
          addDrinkListItem(drink);
        });
      });
    });
    filteredListItem.appendChild(itemButton);
    element.appendChild(filteredListItem);
  }

  function getAll(strOption) {
    return filteredOptionsObj[strOption];
  }

  function renderFilteredList(filterLetter, strOption) {
    document.querySelector('.filtered-options').innerHTML = ''; //clear buttons
    document.querySelector('.drinks').innerHTML = ''; //clear buttons
    getAll(strOption).forEach(function (itemValue) {
      addFilteredListItem(filterLetter, itemValue);
    });
  }

  function add(strOption, listItem) {
    //making key value obj from filter and listItem
    if (!(strOption in filteredOptionsObj)) {
      //so it doesn't redo the key
      filteredOptionsObj[strOption] = []; //making key(strCategory..etc) with an empty array
    }
    if (filteredOptionsObj[strOption].indexOf(listItem) === -1 && listItem !== '') {
      //check if an item is already in the array
      filteredOptionsObj[strOption].push(listItem);
    }
  }

  function fetchFilteredList(filterLetter, strOption) {
    if (filteredOptionsObj[strOption]) {
      //checks if this key is in the object already
      renderFilteredList(filterLetter, strOption);
      return;
    } else {
      return fetch(`https://www.thecocktaildb.com/api/json/v1/1/list.php?${filterLetter}=list`)
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          json.drinks.forEach(function (item) {
            add(strOption, item[strOption]);
          });
        })
        .catch(function (error) {
          console.error(error);
        })
        .then(function () {
          renderFilteredList(filterLetter, strOption);
        });
    }
  }

  return {
    fetchFilteredList: fetchFilteredList,
  };
})();

// cocktailRepository.loadCategoryList().then(function () {
//   // Now the data is loaded!
//   console.log('Data loaded! now getAll()');
//   cocktailRepository.getAll().forEach(function (category) {
//     cocktailRepository.addCategoryListItem(category);
//   });
// });

document.querySelector('.reset').addEventListener('click', function () {
  document.querySelector('.filtered-options').innerHTML = '';
  document.querySelector('.drinks').innerHTML = '';
});
