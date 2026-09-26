import '../sass/style.scss';
import {setMenu} from './modules/set-burger-menu';
import {setTheme} from './modules/set-theme';
import {setProductCards} from './modules/set-products-cards';

window.onload = () => {
  setTheme();
  setMenu();
  setProductCards();
};
