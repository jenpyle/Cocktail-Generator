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
        addDrinkDetails(response);
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
