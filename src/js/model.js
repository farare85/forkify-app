import { API_URL } from './config.js';
import { getJson, sendJson } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    page: 1,
    result: [],
  },
  bookmarks: [],
};

const recipE = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await getJson(
      `${API_URL}${id}?key=c8d0f060-50a6-4d02-88fc-e595f4076508`
    );

    state.recipe = recipE(data);

    if (state.bookmarks.some(el => el.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const searchResult = async function (query) {
  try {
    const { data } = await getJson(
      `${API_URL}?search=${query}&key=c8d0f060-50a6-4d02-88fc-e595f4076508`
    );

    state.search.result = data.recipes.map(el => {
      return {
        id: el.id,
        title: el.title,
        publisher: el.publisher,
        image: el.image_url,
        ...(el.key && { key: el.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getPageResults = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * 10;
  const end = page * 10;

  return state.search.result.slice(start, end);
};

export const newServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });

  state.recipe.servings = servings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (data) {
  state.bookmarks.push(data);

  state.recipe.bookmarked = true;

  persistBookmark();
};

export const delBookmark = function (data) {
  const index = state.bookmarks.findIndex(el => el.id === data.id);

  state.bookmarks.splice(index, 1);
  if (data.bookmarked) data.bookmarked = false;

  persistBookmark();
};

export const uplRecipe = async function (upData) {
  try {
    const ingredients = Object.entries(upData)
      .filter(el => el[0].startsWith('ingredient') && el[1] !== '')
      .map(ingArr => {
        const ing = ingArr[1].replaceAll(' ', '').split(',');
        if (ing.length < 3) throw new Error('Invalid Ingredient Format');
        const [quantity, unit, description] = ing;
        return {
          quantity: quantity === '' ? null : +quantity,
          unit,
          description,
        };
      });

    const recipe = {
      title: upData.title,
      publisher: upData.publisher,
      source_url: upData.sourceUrl,
      image_url: upData.image,
      servings: +upData.servings,
      cooking_time: +upData.cookingTime,
      ingredients,
    };

    const data = await sendJson(
      `${API_URL}?key=c8d0f060-50a6-4d02-88fc-e595f4076508`,
      recipe
    );
    console.log(data);

    state.recipe = recipE(data);
    console.log(state.recipe);

    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
