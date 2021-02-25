let cocktailRepository = (function () {
  let cocktailCategories = [];
  let apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';

  function add(listItem) {
    cocktailCategories.push(listItem);
  }

  // function loadCategoryList() {
  //   return fetch(apiUrl) // fetch returns a Promise
  //     .then(function (response) {
  //       //same thing as last 2 lines of fetchDrinksByCategory function
  //       return response.json();
  //     })
  //     .then(function (json) {
  //       json.drinks.forEach(function (item) {
  //         // this anonymous function is the callback of forEach function, item is the parameter, item is the element of the json.drinks array which is an object
  //         if (item.strCategory === '') {
  //           return;
  //         }
  //         add(item.strCategory);
  //       });
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // }

  function loadFilteredList(filterLetter, strOption) {
    return fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/list.php?${filterLetter}=list`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.drinks.forEach(function (item) {
          //Why doesn't item.strOption work?
          // add(item.strOption);
          add(item.strIngredient1);
        });
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
        //What is going on here? Are these parameters correct?
        getAll().forEach(function (itemValue) {
          addCategoryListItem(filterLetter, itemValue);
        });
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
    drinkItem.classList.add('group-list-item');
    let drinkButton = document.createElement('button');
    drinkButton.classList.add('btn');
    let drinksButtons = document.querySelector('.cocktail-drinks');

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
    console.log('2--filter = ' + filterLetter);
    console.log('2--itemValue = ' + itemValue);
    return fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?${filterLetter}=${itemValue}`
    )
      .then((response) => response.json())
      .then((json) => json.drinks);
    // .catch(function (error) {
    //   console.error(error);
    // })
  }

  function addCategoryListItem(filterLetter, itemValue) {
    let element = document.querySelector('.cocktail-categories');
    let categoryListItem = document.createElement('li');
    categoryListItem.classList.add('group-list-item');
    let categoryButton = document.createElement('button');
    categoryButton.classList.add('btn');
    categoryButton.innerText = itemValue;

    categoryButton.addEventListener('click', function () {
      fetchDrinksByFilter(filterLetter, itemValue).then((drinks) => {
        console.log('0HERE----------' + drinks);
        document.querySelector('.cocktail-drinks').innerHTML = ''; // clear all the drinks, otherwise it would keep appending the drinks of the clicked category at the end
        drinks.forEach((drink) => {
          console.log('HERE-------' + drink);
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
    IngredientsListElement.classList.add('list-group');
    IngredientsListElement.classList.add('modal__ingredients');

    recipe.forEach(function (element) {
      let IngredientsElement = document.createElement('li');
      IngredientsElement.classList.add('group-list-item');
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

  function toggleHideShow(y) {
    console.log('----- ' + y);
    var x = document.querySelector(y);
    console.log(x);
    if (x.style.display === 'none' || x === null) {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  return {
    getAll: getAll,
    // loadCategoryList: loadCategoryList,
    loadFilteredList: loadFilteredList,
    addCategoryListItem: addCategoryListItem,
    toggleHideShow: toggleHideShow,
  };
})();

// cocktailRepository.loadCategoryList().then(function () {
//   // Now the data is loaded!
//   console.log('Data loaded! now getAll()');
//   cocktailRepository.getAll().forEach(function (category) {
//     cocktailRepository.addCategoryListItem(category);
//   });
// });
