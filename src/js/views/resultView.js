import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
  _parentEl = document.querySelector('.results');

  _errorMessage = 'No recipe found for your query! Please try another one';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView(); //this way, there can only be one ResultView because of instantiation.
