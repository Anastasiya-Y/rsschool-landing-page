/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./source/js/utils/utils.js
const isEscapeKey = (evt) => evt.key === 'Escape';



;// ./source/js/modules/set-burger-menu.js


const menuOpenElement = document.querySelector("[data-open-menu]");
const menuCloseElements = document.querySelectorAll("[data-close-menu]");
const menu = document.querySelector("[data-menu]");
const body = document.querySelector("body");
const menuMediaQuery = window.matchMedia("(max-width: 768px)");

const scrollLockToggle = (isMobile) => {
  if (menu.classList.contains("is-open")) {
    !isMobile
      ? body.classList.remove("scroll-lock")
      : body.classList.add("scroll-lock");
  }
};

const menuToggle = () => {
  menu.classList.toggle("is-open");
  if (!menu.classList.contains("is-open")) {
    body.classList.remove("scroll-lock");
  } else {
    body.classList.add("scroll-lock");
  }
};

const closeMenu = () => {
  menu.classList.remove("is-open");
  body.classList.remove("scroll-lock");
};

const setMenu = () => {
  if (menu) {
    if (menuOpenElement) {
      menuOpenElement.addEventListener("click", () => {
        menuToggle();
      });
    }

    if (menuCloseElements.length > 0) {
      for (let i = 0; i < menuCloseElements.length; i++) {
        const menuCloseElement = menuCloseElements[i];
        menuCloseElement.addEventListener("click", () => {
          closeMenu();
        });
      }
    }
  }
  document.addEventListener("keydown", (evt) => {
    if (isEscapeKey(evt)) {
      if (document.querySelector(".main-header__wrapper.is-open")) {
        closeMenu();
      }
    }
  });

  menuMediaQuery.addEventListener("change", (evt) => {
    scrollLockToggle(evt.matches);
  });

  scrollLockToggle(menuMediaQuery.matches);
};



;// ./source/js/modules/set-theme.js
const lightThemeElement = document.querySelector('[data-light-theme]');
const darkThemeElement = document.querySelector('[data-dark-theme]');
const bodyElement = document.body;

const getStartTheme = () => {
  const isInitialTheme = localStorage.getItem('theme');

  return isInitialTheme ? isInitialTheme : 'light';
};

const toggleTheme = (theme) => {
  const isDarkTheme = theme === 'dark';

  bodyElement.classList.toggle('dark', isDarkTheme);
  bodyElement.classList.toggle('light', !isDarkTheme);

  lightThemeElement.classList.toggle('active', isDarkTheme);
  darkThemeElement.classList.toggle('active', !isDarkTheme);

  localStorage.setItem('theme', theme);
};

const setTheme = () => {
  const startTheme = getStartTheme();

  bodyElement.classList.add(startTheme);

  lightThemeElement.addEventListener('click', () => toggleTheme('light'));
  darkThemeElement.addEventListener('click', () => toggleTheme('dark'));
};



;// ./source/js/index.js




window.onload = () => {
  setTheme();
  setMenu();
};

/******/ })()
;
//# sourceMappingURL=main.js.map