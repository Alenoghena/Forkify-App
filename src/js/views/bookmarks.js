import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class bookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');

  _errorMessage = 'No bookmark yet. Please find and bookmark a recipe';
  _message = '';

  _generateMarkup() {
    console.log(this._data);

    return this._data.map(this._generateMarkup).join('');
  }
  _clearInput() {
    this._parentEl.querySelector('.bookmarks__list').value = '';
  }

  addhandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new bookmarkView(); //this way, there can only be one ResultView because of instantiation.
