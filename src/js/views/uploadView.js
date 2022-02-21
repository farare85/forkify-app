import View from './view.js';
import icons from '../../img/icons.svg';

class UploadView extends View {
  _parentElement = document.querySelector('.upload');
  _successMsg = 'Recipe upload successful';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _open = document.querySelector('.nav__btn--add-recipe');

  _close = document.querySelector('.btn--close-modal');

  constructor() {
    super();

    this._addHandlerClose();
    this._addHandlerOpen();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _addHandlerOpen() {
    this._open.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerClose() {
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    this._close.addEventListener('click', this.toggleWindow.bind(this));
  }

  _generateMarkup() {}
}

export default new UploadView();
