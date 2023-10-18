import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _renderTwobuttons(page) {
    return `
    <div class="pagination">
    <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${page - 1}</span>
    </button>
    <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  </div>
    `;
  }
  _renderRbutton(page) {
    return `
    <button data-goto="${page + 1}"class="btn--inline pagination__btn--next">
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  </div>
  </div>
  `;
  }
  _renderLbutton(page) {
    return `
    <div class="pagination">
    <button data-goto="${page - 1}"class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${page - 1}</span>
    </button>
  </div>
  `;
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    console.log(numPages);

    //page1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._renderRbutton(currentPage);
    }
    //page1 and no other pages
    //Only first page
    if (currentPage === 1 && numPages === 1) return '';

    //last page
    if (currentPage === numPages && numPages > 1) {
      return this._renderLbutton(currentPage);
    }
    //other pages
    if (currentPage < numPages && currentPage > 1) {
      return this._renderTwobuttons(currentPage);
    }
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      console.log(btn);

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
}

export default new PaginationView();
