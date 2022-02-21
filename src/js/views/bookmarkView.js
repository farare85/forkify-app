import View from './view.js';
import icons from '../../img/icons.svg';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMsg = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHandlerBookmark(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return this._data
      .map(el => {
        return `
        <li class="preview">
          <a class="preview__link ${
            el.id === id ? 'preview__link--active' : ''
          }" href="#${el.id}">
            <figure class="preview__fig">
              <img src="${el.image}" alt="${el.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${el.title}</h4>
              <p class="preview__publisher">${el.publisher}</p>
                <div class="preview__user-generated ${el.key ? '' : 'hidden'}">
                  <svg>
                  <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
            </div>
          </a>
        </li>
      `;
      })
      .join('');
  }
}

export default new BookmarkView();