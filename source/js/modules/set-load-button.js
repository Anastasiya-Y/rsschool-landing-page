const MAX_VISIBLE_ITEMS = 4;
const MOBILE_MEDIA_QUERY = '(max-width: 768px)';
const HIDDEN_CLASS = 'hidden';

const mobileMediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

const getCards = () => [...document.querySelectorAll('.catalog__list .catalog__item')];

const hideCards = (cards, count) => {
  cards.forEach((card, index) => {
    card.classList.toggle(HIDDEN_CLASS, index >= count);
  });
};

const showCards = (cards) => cards.forEach((card) => card.classList.remove(HIDDEN_CLASS));

const updateLoadButton = () => {
  const loadButton = document.querySelector('.catalog__loader');

  if (!loadButton) {
    return;
  }

  const cards = getCards();
  const isMobile = mobileMediaQuery.matches;
  const toCollapse = isMobile && cards.length > MAX_VISIBLE_ITEMS;

  loadButton.classList.toggle(HIDDEN_CLASS, !toCollapse);

  if (toCollapse) {
    hideCards(cards, MAX_VISIBLE_ITEMS);
  } else {
    showCards(cards);
  }
};

const setLoadButton = () => {
  const loadButton = document.querySelector('.catalog__loader');
  if (!loadButton) {
    return;
  }

  loadButton.addEventListener('click', () => {
    showCards(getCards());
    loadButton.classList.add(HIDDEN_CLASS);
  });

  mobileMediaQuery.addEventListener('change', updateLoadButton);
};

export {updateLoadButton, setLoadButton};
