import '../sass/style.scss';
import {setMenu} from './modules/set-burger-menu';
import {setTheme} from './modules/set-theme';

window.onload = () => {
  setTheme();
  setMenu();
};
