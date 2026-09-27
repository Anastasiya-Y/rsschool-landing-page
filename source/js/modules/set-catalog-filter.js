import {setProductCards} from './set-product-cards';
import data from '../data/products.json';
import {updateLoadButton} from './set-load-button';

const DEFAULT_FILTER = 'coffee';

const catalogFilterList = document.querySelector('.catalog__filter-list');

const removeSelectedFilterButtons = () => {
  const filterButtons = catalogFilterList.querySelectorAll('.catalog__filter-button');

  filterButtons.forEach((button) => button.classList.remove('is-active'));
};

const filterItemsByCategory = (targetFilter = DEFAULT_FILTER) => {
  setProductCards(data, targetFilter);

  updateLoadButton();
};

const setCatalogFilter = () => {
  if (catalogFilterList) {
    catalogFilterList.addEventListener('click', (evt) => {
      const filterButton = evt.target.closest('.catalog__filter-button');

      if (filterButton) {
        const targetFilter = filterButton.dataset.filter;

        removeSelectedFilterButtons();
        filterButton.classList.add('is-active');
        filterItemsByCategory(targetFilter);
      }
    });

    const defaultButtonNode = catalogFilterList.querySelector(`.catalog__filter-button[data-filter="${DEFAULT_FILTER}"]`);
    if (defaultButtonNode) {
      defaultButtonNode.classList.add('is-active');
    }

    filterItemsByCategory();
  }
};

export {setCatalogFilter};
