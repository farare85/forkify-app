import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import uploadView from './views/uploadView';

// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultView.update(model.getPageResults());
    bookmarkView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const searchResult = async function () {
  try {
    query = searchView.getQuery();
    if (!query) return;

    resultView.renderSpinner();

    await model.searchResult(query);

    resultView.render(model.getPageResults(1));

    paginationView.render(model.state.search);
  } catch (err) {
    alert(err);
  }
};

const pagNav = function (page) {
  resultView.render(model.getPageResults(page));

  paginationView.render(model.state.search);
};

const updateServings = function (servings) {
  if (servings < 1) return;

  model.newServings(servings);

  const { recipe } = model.state;

  recipeView.update(recipe);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.delBookmark(model.state.recipe);
  }

  bookmarkView.render(model.state.bookmarks);
  recipeView.update(model.state.recipe);
};

const loadBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const uploadRecipe = async function (data) {
  try {
    uploadView.renderSpinner();
    await model.uplRecipe(data);

    recipeView.render(model.state.recipe);
    uploadView.renderSuccess();

    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      uploadView.toggleWindow();
    }, 1500);
  } catch (err) {
    console.error(err);
    uploadView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerBookmark(loadBookmark);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerServings(updateServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  searchView.addHandlerSearch(searchResult);
  paginationView.addHandlerClick(pagNav);
  uploadView.addHandlerUpload(uploadRecipe);
};

init();
