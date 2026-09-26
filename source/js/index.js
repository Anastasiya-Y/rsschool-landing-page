import '../sass/style.scss';
import {setMenu} from './modules/set-burger-menu';
import {setTheme} from './modules/set-theme';
import {setLoadButton} from './modules/set-load-button';
import {setCatalogFilter} from './modules/set-catalog-filter';

document.addEventListener('DOMContentLoaded', () => {
  setTheme();
  setMenu();
  setLoadButton();
  setCatalogFilter();
});
