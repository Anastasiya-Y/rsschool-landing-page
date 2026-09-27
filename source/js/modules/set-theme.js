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

export {setTheme};
