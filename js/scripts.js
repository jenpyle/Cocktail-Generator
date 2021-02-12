let cocktailRepository = (function () {
  let cocktailCategories = [];
  let apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';

  function add(category) {
    cocktailCategories.push(category);
  }

  function getAll() {
    return cocktailCategories;
  }

  function loadList() {
    showLoadingIcon();
    return fetch(apiUrl) // fetch returns a Promise
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        hideLoadingIcon();
        console.log(json, '!!drinks'); // check the Api response (json)
        json.drinks.forEach(function (item) {
          // this anonymous function is the callback of forEach function, item is the parameter, item is the element of the json.drinks array which is an object
          add(item.strCategory);
        });
      })
      .catch(function (error) {
        hideLoadingIcon();
        console.error(error);
      });
  }

  function addListItem(category) {
    let element = document.querySelector('.cocktail-categories');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = category;
    button.classList.add('drink-info-button');

    button.addEventListener('click', function () {
      fetchDrinksByCategory(category).then((drinks) => {
        document.querySelector('.drinks').innerHTML = ''; // clear all the drinks, otherwise it would keep appending the drinks of the clicked category at the end
        drinks.forEach((drink) => {
          // you can inspect api response under Network tab > XHR > Response
          let drinkItem = document.createElement('div');
          drinkItem.innerText = drink.strDrink;
          document.querySelector('.drinks').appendChild(drinkItem);
        });
      });
    }); //Event Listener
    listItem.appendChild(button); //append button to list item
    element.appendChild(listItem); //append list item to parent
    // showDetails(category); //call new function inside addListItem() after button is appended to DOM
  }

  function fetchDrinksByCategory(category) {
    return fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
    )
      .then((response) => response.json())
      .then((json) => json.drinks);
  }

  //! Need help assigning names to multiple drinks?
  function loadMoreDetails(item) {
    showLoadingIcon();
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
        hideLoadingIcon();
        item.glass = details.strGlass;
        console.log('--' + details.strGlass); //Why undefined?
        item.instructions = details.strInstructions;
        // item.ingredient = details.strIngredient1; add for-loop to iterate thru object?
        item.isAlcoholic = details.strAlcoholic;
        // item.measure = details.strMeasure1; add for-loop to iterate thru object?
      })
      .catch(function (e) {
        hideLoadingIcon();
        console.error(e);
      });
  }

  var spinner = document.querySelector('.loader');
  function showLoadingIcon() {
    console.log('LOADING');

    spinner.classList.add('spin');
    setTimeout(function () {}, 1500);
  }

  function hideLoadingIcon() {
    spinner.classList.remove('spin');
    console.log('DONE');
  }

  return {
    getAll: getAll,
    loadList: loadList,
    addListItem: addListItem,
  };
})();

cocktailRepository.loadList().then(function () {
  // Now the data is loaded!
  cocktailRepository.getAll().forEach(function (category) {
    cocktailRepository.addListItem(category);
  });
});
