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
        console.log(json, '!!drinks'); // check the Api response (json) to get the name 'drinks'
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

  function addDrinkDetails(response) {
    let selectedDrink = response[0];
    showModal(response);

    let drinkDetailsElem = document.querySelector('.cocktail-details');
    let drinkTitleElem = document.createElement('h3');

    drinkDetailsElem.innerHTML = '';
    drinkTitleElem.innerText = selectedDrink.strDrink;
    drinkDetailsElem.appendChild(drinkTitleElem);

    let drinkInstructionsElem = document.createElement('p');
    drinkInstructionsElem.innerText = selectedDrink.strInstructions;
    drinkDetailsElem.appendChild(drinkInstructionsElem);

    let drinkImageElem = document.createElement('img');
    drinkImageElem.src = selectedDrink.strDrinkThumb;
    drinkDetailsElem.appendChild(drinkImageElem);
  }

  function fetchDetailsByDrinkName(name) {
    console.log('ooo' + name);
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
    console.log('HERE');
    return fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
    )
      .then((response) => response.json()) //what do these do?
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

  function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.remove('is-visible');
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
    let title = selectedDrink.strDrink;
    let instructions = selectedDrink.strInstructions;
    let image = selectedDrink.strDrinkThumb;

    let modalContainer = document.querySelector('#modal-container');
    modalContainer.innerHTML = ''; //to clear it

    let modal = document.createElement('div');
    modal.classList.add('modal');

    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    let titleElement = document.createElement('h1');
    titleElement.innerText = title;

    let contentElement = document.createElement('p');
    contentElement.classList.add('modal__instructions');
    contentElement.innerText = instructions;

    let ingredientsElement = makeIngredientsListElement(selectedDrink);

    let drinkImageElem = document.createElement('img');
    drinkImageElem.src = image;
    drinkImageElem.classList.add('modal__image');

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modal.appendChild(ingredientsElement);
    modal.appendChild(drinkImageElem);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');
  }

  return {
    getAll: getAll,
    loadCategoryList: loadCategoryList,
    addCategoryListItem: addCategoryListItem,
    showModal: showModal,
    hideModal: hideModal,
  };
})();

cocktailRepository.loadCategoryList().then(function () {
  // Now the data is loaded!
  console.log('Data loaded! now getAll()');
  cocktailRepository.getAll().forEach(function (category) {
    cocktailRepository.addCategoryListItem(category);
  });
});

window.addEventListener('keydown', (e) => {
  let modalContainer = document.querySelector('#modal-container');
  if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
    cocktailRepository.hideModal();
  }
});

let modalContainer = document.querySelector('#modal-container');
modalContainer.addEventListener('click', (e) => {
  // Since this is also triggered when clicking INSIDE the modal
  // We only want to close if the user clicks directly on the overlay
  let target = e.target;
  if (target === modalContainer) {
    cocktailRepository.hideModal();
  }
});
