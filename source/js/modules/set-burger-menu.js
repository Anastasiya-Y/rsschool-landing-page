import {isEscapeKey} from '../utils/utils.js';

const SCROLL_LOCK_CLASS = 'scroll-lock';
const OPEN_CLASS = 'is-open';

const menuOpenNode = document.querySelector('[data-open-menu]');
const menuCloseNodes = document.querySelectorAll('[data-close-menu]');
const menuNode = document.querySelector('[data-menu]');
const bodyNode = document.body;
const menuMediaQuery = window.matchMedia('(max-width: 768px)');

const menuToggle = () => {
  const isOpen = menuNode.classList.toggle(OPEN_CLASS);
  bodyNode.classList.toggle(SCROLL_LOCK_CLASS, isOpen);
};

const closeMenu = () => {
  menuNode.classList.remove(OPEN_CLASS);
  bodyNode.classList.remove(SCROLL_LOCK_CLASS);
};

const onMenuLinkClick = (evt) => {
  const linkNode = evt.target.closest('a');
  if (linkNode && menuNode.contains(linkNode)) {
    closeMenu();
  }
};

const setMenu = () => {
  if (!menuNode) {
    return;
  }

  if (menuOpenNode) {
    menuOpenNode.addEventListener('click', () => {
      menuToggle();
    });
  }

  menuCloseNodes.forEach((node) => {
    node.addEventListener('click', closeMenu);
  });

  menuNode.addEventListener('click', onMenuLinkClick);

  document.addEventListener('keydown', (evt) => {
    if (!isEscapeKey(evt)) {
      return;
    }

    if (menuNode.classList.contains(OPEN_CLASS)) {
      closeMenu();
    }
  });

  menuMediaQuery.addEventListener('change', (evt) => {
    if (!evt.matches) {
      closeMenu();
    }
  });
};

export {setMenu};
