import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeview from './views/recipeview.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarks.js';
import addRecipeView from './views/addRecipeView.js';
import { timeout } from './helpers.js';
import 'core-js/stable'; //for polyfiling others, not async/await
import 'regenerator-runtime/runtime'; //async/await

//Below is coming from parcel
if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//This controller increases or reduces servings

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    //Guard clause
    if (!id) return;
    //0. Update resultview to mark selected search result
    resultView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);
    //1. loading recipe

    await model.loadRecipe(id); //this does not return anything, so we won't store it on any variable

    recipeview.renderSpinner();

    //2. Rendering recipe
    recipeview.render(model.state.recipe);

    //updating bookmark
  } catch (err) {
    recipeview.renderError();
    recipeview.renderMessage();
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //1) get search query
    const query = searchView.getQuery();
    if (!query) return; //guard clause
    //2.) Load search results
    await model.loadSearchResults(query);

    //3. render results
    resultView.render(model.getSearchResultPage(1));
    //4. render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlPagination = function (goToPage) {
  //3. render results
  resultView.render(model.getSearchResultPage(goToPage));
  //4. render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (btnIncrement) {
  //1. Updating the recipe servings (in the state)

  model.updateServings(btnIncrement);
  //2. Updating the recipe view

  recipeview.update(model.state.recipe);
};

const controlAddDelBookmark = function () {
  // const id = window.location.hash.slice(1);
  //1.add/remove bookmark

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe); //using if statement here gets it deleted. so else statement is prefered.

  //2. update recipeview
  recipeview.update(model.state.recipe);
  //3. update bookmarks

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeview.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL using history API
    //The pushState takes 3 args: state, title and url. the first 2 may be ignored as below
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //we can also use history API for back and forward
    // window.history.back();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
//Subscriber function
const init = function () {
  bookmarkView.addhandlerRender(controlBookmarks);
  recipeview.addHandlerRender(controlRecipes);
  recipeview.addHandlerUpdateServings(controlServings);
  recipeview.addHandlerBookmark(controlAddDelBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
