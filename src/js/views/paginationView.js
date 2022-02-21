import View from './view.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      const goTo = +btn.dataset.goto;
      console.log(goTo);
      handler(goTo);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.result.length / 10);
    if (curPage === 1 && numPages === curPage) {
      return ``;
    }
    if (curPage === 1 && numPages > curPage) {
      return `
        <button data-goTo = '${
          curPage + 1
        }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    if (curPage > 1 && curPage < numPages) {
      return `
        <button data-goTo = '${
          curPage - 1
        }' class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${curPage - 1}</span>
        </button>
        <button data-goTo = '${
          curPage + 1
        }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    if (curPage === numPages) {
      return `
        <button data-goTo = '${
          curPage - 1
        }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
      `;
    }
  }
}

export default new PaginationView();
