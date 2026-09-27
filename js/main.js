/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./source/js/utils/utils.js
const isEscapeKey = (evt) => evt.key === 'Escape';

const createNode = (tag, text, className) => {
  const node = document.createElement(tag);

  if (text !== null) {
    node.textContent = text;
  }

  if (className) {
    node.className = className;
  }

  return node;
};



;// ./source/js/modules/set-burger-menu.js


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



;// ./source/js/modules/set-load-button.js
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



;// ./source/js/modules/set-modal.js


const DEFAULT_ADDITIONAL_PRICE = 0.5;
class Modal {
  constructor(item) {
    Object.assign(this, item);
    this.template = document.querySelector('#modal-template');
    this.modalNode = null;
    this.imgNode = null;
    this.nameNode = null;
    this.descriptionNode = null;
    this.sizesNode = null;
    this.additivesNode = null;
    this.priceNode = null;
    this.closeButton = null;
    this.currentPrice = null;
  }

  updatePrice() {
    const basePrice = Number(this.price) || 0;

    const activeSizeNode =
      this.sizesNode && this.sizesNode.querySelector('.is-active');
    const sizePrice = activeSizeNode ? Number(activeSizeNode.dataset.price) : 0;

    const selectedAdditives = this.additivesNode
      ? [...this.additivesNode.querySelectorAll('.is-active')]
      : [];
    const additivesPrice = selectedAdditives.reduce(
      (sum, node) => sum + Number(node.dataset.price),
      0
    );

    const total = basePrice + sizePrice + additivesPrice;

    if (this.priceNode) {
      this.priceNode.textContent = `$${total.toFixed(2)}`;
    }

    this.currentPrice = total;
  }

  setSizes() {
    const keys = Object.keys(this.sizes);

    keys.forEach((item, index) => {
      const sizeNode = createNode('li', null, 'modal__options-item');

      if (index === 0) {
        sizeNode.classList.add('is-active');
      }

      sizeNode.dataset.price = index * DEFAULT_ADDITIONAL_PRICE;

      sizeNode.append(createNode('span', item));
      sizeNode.append(createNode('span', this.sizes[item].size));

      this.sizesNode.append(sizeNode);
    });

    this.sizesNode.addEventListener('click', (evt) => {
      const sizeNode = evt.target.closest('.modal__options-item');

      if (!sizeNode) {
        return;
      }

      const activeSizeNode = this.sizesNode.querySelector('.is-active');

      if (activeSizeNode) {
        activeSizeNode.classList.remove('is-active');
      }

      sizeNode.classList.add('is-active');
      this.updatePrice();
    });
  }

  setAdditives() {
    this.additives.forEach((item, index) => {
      const additiveNode = createNode('li', null, 'modal__options-item');

      additiveNode.dataset.price = DEFAULT_ADDITIONAL_PRICE;

      additiveNode.append(createNode('span', index + 1));
      additiveNode.append(createNode('span', item.name));

      this.additivesNode.append(additiveNode);
    });

    this.additivesNode.addEventListener('click', (evt) => {
      const additiveNode = evt.target.closest('.modal__options-item');

      if (!additiveNode) {
        return;
      }

      additiveNode.classList.toggle('is-active');
      this.updatePrice();
    });
  }
  setContent() {
    this.imgNode = this.modalNode.querySelector('.modal__image-wrapper img');
    this.nameNode = this.modalNode.querySelector('.modal__text h3');
    this.descriptionNode = this.modalNode.querySelector('.modal__text p');
    this.sizesNode = this.modalNode.querySelector('.modal__options-list.modal__options-list--size');
    this.additivesNode = this.modalNode.querySelector('.modal__options-list.modal__options-list--additives');
    this.priceNode = this.modalNode.querySelector('.modal__total-price');

    if (this.imageName) {
      this.imgNode.src = `img/content/catalog/${this.imageName}`;
      this.imgNode.alt = this.name ? `Photo of ${this.name}.` : '';
    }

    if (this.name) {
      this.nameNode.textContent = this.name;
    }

    if (this.description) {
      this.descriptionNode.textContent = this.description;
    }

    if (this.sizes) {
      this.setSizes();
    } else {
      const wrapperNode = this.sizesNode.closest('.modal__size');

      if (wrapperNode) {
        wrapperNode.remove();
      }
    }

    if (this.additives) {
      this.setAdditives();
    } else {
      const wrapperNode = this.additivesNode.closest('.modal__additives');

      if (wrapperNode) {
        wrapperNode.remove();
      }
    }

    if (this.price) {
      this.currentPrice = Number(this.price);
      this.priceNode.textContent = `$${this.currentPrice.toFixed(2)}`;
    }
  }

  closeModal() {
    if (!this.modalNode) return;

    document.removeEventListener('keydown', this.closeModalOnEsc);

    this.modalNode.remove();
    this.modalNode = null;
    document.body.classList.remove('scroll-lock');
  }

  closeModalOnEsc = (evt) => {
    if (isEscapeKey(evt)) {
      this.closeModal();
    }
  };

  addModalEventListeners() {
    this.closeButton = this.modalNode.querySelector('[data-close-modal]');

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.closeModal());
    }

    this.modalNode.addEventListener('click', (evt) => {
      if (!evt.target.closest('.modal__content')) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', this.closeModalOnEsc);
  }

  createModal() {
    this.modalNode = this.template.content.firstElementChild.cloneNode(true);
    this.setContent();
    this.addModalEventListeners();

    document.body.append(this.modalNode);
    document.body.classList.add('scroll-lock');

    return this.modalNode;
  }
}

;// ./source/js/modules/set-product-cards.js



class ProductCard {
  constructor({name, id, description, price, category, imageName}) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.price = price;
    this.category = category;
    this.imageName = imageName;
  }

  createImage() {
    const wrapperNode = createNode('div', null, 'catalog__image-wrapper');

    const imgNode = document.createElement('img');
    imgNode.src = `img/content/catalog/${this.imageName}`;
    imgNode.width = 310;
    imgNode.height = 310;
    imgNode.alt = `Photos of ${this.name}.`;
    imgNode.loading = 'lazy';

    wrapperNode.append(imgNode);

    return wrapperNode;
  }

  createProductCard() {
    const productCard = createNode('li', null, 'catalog__item');
    productCard.dataset.id = this.id;
    productCard.dataset.filter = this.category;

    if (this.imageName) {
      const imageWrapperNode = this.createImage();
      productCard.append(imageWrapperNode);
    }

    if (this.name || this.description || this.price) {
      const textNode = createNode('div', null, 'catalog__item-text');

      if (this.name) {
        const nameNode = createNode('h3', this.name);
        textNode.append(nameNode);
      }

      if (this.description) {
        const descriptionNode = createNode('p', this.description);
        textNode.append(descriptionNode);
      }

      if (this.price) {
        const priceNode = createNode('span', `$${this.price}`);
        textNode.append(priceNode);
      }

      productCard.append(textNode);
    }

    return productCard;
  }
}

const generateProductCards = (data, targetFilter) => {
  const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    if (item.category === targetFilter) {
      const card = new ProductCard(item);
      fragment.append(card.createProductCard());
    }
  });

  return fragment;
};

const renderModal = (data) => {
  if (document.querySelector('.modal')) {
    return;
  }

  const modal = new Modal(data);

  modal.createModal();
};


const setProductCards = (data, targetFilter) => {
  if (!data.length) {
    return;
  }

  const productCardsContainer = document.querySelector('.catalog__list');

  if (productCardsContainer) {
    productCardsContainer.innerHTML = '';
    productCardsContainer.append(generateProductCards(data, targetFilter));

    productCardsContainer.addEventListener('click', (evt) => {
      const catalogItemNode = evt.target.closest('.catalog__item');

      if (catalogItemNode) {
        const id = catalogItemNode.dataset.id;
        const targetData = data.find((item) => item.id === id);
        renderModal(targetData);
      }
    });
  }
};



;// ./source/js/data/products.json
const products_namespaceObject = /*#__PURE__*/JSON.parse('[{"name":"Irish coffee","id":"irish-coffee","description":"Fragrant black coffee with Jameson Irish whiskey and whipped milk","price":"7.00","category":"coffee","imageName":"irish-coffee.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Cinnamon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Kahlua coffee","id":"kahlua-coffee","description":"Classic coffee with milk and Kahlua liqueur under a cap of frothed milk","price":"7.00","category":"coffee","imageName":"kahlua-coffee.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Cinnamon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Honey raf","id":"honey-raf","description":"Espresso with frothed milk, cream and aromatic honey","price":"5.50","category":"coffee","imageName":"honey-raf.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Cinnamon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Ice cappuccino","id":"ice-cappuccino","description":"Cappuccino with soft thick foam in summer version with ice","price":"5.00","category":"coffee","imageName":"ice-cappuccino.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Cinnamon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Espresso","id":"espresso","description":"Classic black coffee","price":"4.50","category":"coffee","imageName":"espresso.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Cinnamon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Latte","id":"latte","description":"Espresso coffee with the addition of steamed milk and dense milk foam","price":"5.50","category":"coffee","imageName":"latte.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Cinnamon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Latte macchiato","id":"latte-macchiato","description":"Espresso with frothed milk and chocolate","price":"5.50","category":"coffee","imageName":"latte-macchiato.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Cinnamon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Coffee with cognac","id":"coffee-with-cognac","description":"Fragrant black coffee with cognac and whipped cream","price":"6.50","category":"coffee","imageName":"coffee-with-cognac.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Cinnamon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Moroccan","id":"moroccan","description":"Fragrant black tea with the addition of tangerine, cinnamon, honey, lemon and mint","price":"4.50","category":"tea","imageName":"moroccan.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Lemon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Ginger","id":"ginger","description":"Original black tea with fresh ginger, lemon and honey","price":"5.00","category":"tea","imageName":"ginger.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Lemon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Cranberry","id":"cranberry","description":"Invigorating black tea with cranberry and honey","price":"5.00","category":"tea","imageName":"cranberry.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Lemon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Sea buckthorn","id":"sea-buckthorn","description":"Toning sweet black tea with sea buckthorn, fresh thyme and cinnamon","price":"5.50","category":"tea","imageName":"sea-buckthorn.jpg","sizes":{"s":{"size":"200 ml","add-price":"0.00"},"m":{"size":"300 ml","add-price":"0.50"},"l":{"size":"400 ml","add-price":"1.00"}},"additives":[{"name":"Sugar","add-price":"0.50"},{"name":"Lemon","add-price":"0.50"},{"name":"Syrup","add-price":"0.50"}]},{"name":"Marble cheesecake","id":"marble-cheesecake","description":"Philadelphia cheese with lemon zest on a light sponge cake and red currant jam","price":"3.50","category":"dessert","imageName":"marble-cheesecake.jpg","sizes":{"s":{"size":"50 g","add-price":"0.00"},"m":{"size":"100 g","add-price":"0.50"},"l":{"size":"200 g","add-price":"1.00"}},"additives":[{"name":"Berries","add-price":"0.50"},{"name":"Nuts","add-price":"0.50"},{"name":"Jam","add-price":"0.50"}]},{"name":"Red velvet","id":"red-velvet","description":"Layer cake with cream cheese frosting","price":"4.00","category":"dessert","imageName":"red-velvet.jpg","sizes":{"s":{"size":"50 g","add-price":"0.00"},"m":{"size":"100 g","add-price":"0.50"},"l":{"size":"200 g","add-price":"1.00"}},"additives":[{"name":"Berries","add-price":"0.50"},{"name":"Nuts","add-price":"0.50"},{"name":"Jam","add-price":"0.50"}]},{"name":"Cheesecakes","id":"cheesecakes","description":"Soft cottage cheese pancakes with sour cream and fresh berries and sprinkled with powdered sugar","price":"4.50","category":"dessert","imageName":"cheesecakes.jpg","sizes":{"s":{"size":"50 g","add-price":"0.00"},"m":{"size":"100 g","add-price":"0.50"},"l":{"size":"200 g","add-price":"1.00"}},"additives":[{"name":"Berries","add-price":"0.50"},{"name":"Nuts","add-price":"0.50"},{"name":"Jam","add-price":"0.50"}]},{"name":"Creme brulee","id":"creme-brulee","description":"Delicate creamy dessert in a caramel basket with wild berries","price":"4.00","category":"dessert","imageName":"creme-brulee.jpg","sizes":{"s":{"size":"50 g","add-price":"0.00"},"m":{"size":"100 g","add-price":"0.50"},"l":{"size":"200 g","add-price":"1.00"}},"additives":[{"name":"Berries","add-price":"0.50"},{"name":"Nuts","add-price":"0.50"},{"name":"Jam","add-price":"0.50"}]},{"name":"Pancakes","id":"pancakes","description":"Tender pancakes with strawberry jam and fresh strawberries","price":"4.50","category":"dessert","imageName":"pancakes.jpg","sizes":{"s":{"size":"50 g","add-price":"0.00"},"m":{"size":"100 g","add-price":"0.50"},"l":{"size":"200 g","add-price":"1.00"}},"additives":[{"name":"Berries","add-price":"0.50"},{"name":"Nuts","add-price":"0.50"},{"name":"Jam","add-price":"0.50"}]},{"name":"Honey cake","id":"honey-cake","description":"Classic honey cake with delicate custard","price":"4.50","category":"dessert","imageName":"honey-cake.jpg","sizes":{"s":{"size":"50 g","add-price":"0.00"},"m":{"size":"100 g","add-price":"0.50"},"l":{"size":"200 g","add-price":"1.00"}},"additives":[{"name":"Berries","add-price":"0.50"},{"name":"Nuts","add-price":"0.50"},{"name":"Jam","add-price":"0.50"}]},{"name":"Chocolate cake","id":"chocolate-cake","description":"Cake with hot chocolate filling and nuts with dried apricots","price":"5.50","category":"dessert","imageName":"chocolate-cake.jpg","sizes":{"s":{"size":"50 g","add-price":"0.00"},"m":{"size":"100 g","add-price":"0.50"},"l":{"size":"200 g","add-price":"1.00"}},"additives":[{"name":"Berries","add-price":"0.50"},{"name":"Nuts","add-price":"0.50"},{"name":"Jam","add-price":"0.50"}]},{"name":"Black forest","id":"black-forest","description":"A combination of thin sponge cake with cherry jam and light chocolate mousse","price":"6.50","category":"dessert","imageName":"black-forest.jpg","sizes":{"s":{"size":"50 g","add-price":"0.00"},"m":{"size":"100 g","add-price":"0.50"},"l":{"size":"200 g","add-price":"1.00"}},"additives":[{"name":"Berries","add-price":"0.50"},{"name":"Nuts","add-price":"0.50"},{"name":"Jam","add-price":"0.50"}]}]');
;// ./source/js/modules/set-catalog-filter.js




const DEFAULT_FILTER = 'coffee';

const catalogFilterList = document.querySelector('.catalog__filter-list');

const removeSelectedFilterButtons = () => {
  const filterButtons = catalogFilterList.querySelectorAll('.catalog__filter-button');

  filterButtons.forEach((button) => button.classList.remove('is-active'));
};

const filterItemsByCategory = (targetFilter = DEFAULT_FILTER) => {
  setProductCards(products_namespaceObject, targetFilter);

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



;// ./source/js/modules/set-slider.js


const CONFIG = {
  desktop: 480,
  mobile: 348,
  swipeThreshold: 50,
  minSlidesCount: 2,
};

const sliderNode = document.querySelector('.favourites-coffee__wrapper');
const sliderListNode = document.querySelector('.favourites-coffee__list');
const sliderButtonPrevNode = document.querySelector('.favourites-coffee__button--prev');
const sliderButtonNextNode = document.querySelector('.favourites-coffee__button--next');
const paginationNode = document.querySelector('.favourites-coffee__pagination');

const set_slider_mobileMediaQuery = window.matchMedia('(max-width: 767px)');

const realSlideNodes = (sliderListNode && [...sliderListNode.children]) || [];
const realSlidesCount = realSlideNodes.length;

let activeBulletNode = null;
let slideCounter = 0;
let isAnimating = false;
let pendingTargetReal = null;
let pendingTargetDomPos = null;

const getStep = () =>
  set_slider_mobileMediaQuery.matches ? CONFIG.mobile : CONFIG.desktop;

const domPosition = (realIndex) => realIndex + 1;

const setPosition = (domIndex, instant = false) => {
  const step = getStep();

  if (instant) {
    sliderListNode.style.transition = 'none';
  }

  sliderListNode.style.left = `-${domIndex * step}px`;

  if (instant) {
    sliderListNode.getBoundingClientRect();
    sliderListNode.style.transition = '';
  }
};

const createBulletNode = (index) => {
  const bulletNode = createNode('button', null, 'favourites-coffee__pagination-button');

  bulletNode.type = 'button';
  bulletNode.dataset.index = index;
  bulletNode.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);

  const loaderNode = createNode('span', null, 'favourites-coffee__pagination-loader');

  bulletNode.append(loaderNode);

  if (index === 0) {
    bulletNode.classList.add('is-active');
    activeBulletNode = bulletNode;
  }

  return bulletNode;
};

const addCloneSlides = () => {
  if (realSlidesCount < CONFIG.minSlidesCount) {
    return;
  }

  const firstCloneNode = realSlideNodes[0].cloneNode(true);
  const lastCloneNode = realSlideNodes[realSlidesCount - 1].cloneNode(true);

  [firstCloneNode, lastCloneNode].forEach((clone) => {
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
  });

  sliderListNode.prepend(lastCloneNode);
  sliderListNode.append(firstCloneNode);
};

const setLoaderState = (state) => {
  if (!activeBulletNode) {
    return;
  }

  const loaderNode = activeBulletNode.querySelector('.favourites-coffee__pagination-loader');

  if (!loaderNode || loaderNode.style.animationPlayState === state) {
    return;
  }

  loaderNode.style.animationPlayState = state;
};

const pauseLoader = () => setLoaderState('paused');
const resumeLoader = () => setLoaderState('running');

const onHover = (evt, loaderAction) => {
  const slide = evt.target.closest('.favourites-coffee__card');

  if (!slide || slide.contains(evt.relatedTarget)) {
    return;
  }

  if (loaderAction === 'resume') {
    resumeLoader();
  } else {
    pauseLoader();
  }
};

const updatePaginationButton = () => {
  const currentBullet = paginationNode.querySelector(`.favourites-coffee__pagination-button[data-index='${slideCounter}']`);

  if (!activeBulletNode || !currentBullet) {
    return;
  }

  activeBulletNode.classList.remove('is-active');
  currentBullet.classList.add('is-active');
  activeBulletNode = currentBullet;

  const loaderNode = currentBullet.querySelector('.favourites-coffee__pagination-loader');

  if (loaderNode) {
    loaderNode.style.animation = 'none';
    loaderNode.getBoundingClientRect();
    loaderNode.style.animation = '';
    loaderNode.style.animationPlayState = 'running';
  }
};

const onSlideChangeNext = () => {
  if (isAnimating) {
    return;
  }

  isAnimating = true;

  const lastReal = realSlidesCount - 1;
  pendingTargetReal = slideCounter === lastReal ? 0 : slideCounter + 1;
  pendingTargetDomPos = domPosition(slideCounter) + 1;

  setPosition(pendingTargetDomPos);
};

const onSlideChangePrev = () => {
  if (isAnimating) {
    return;
  }

  isAnimating = true;

  const lastReal = realSlidesCount - 1;
  pendingTargetReal = slideCounter === 0 ? lastReal : slideCounter - 1;
  pendingTargetDomPos = domPosition(slideCounter) - 1;

  setPosition(pendingTargetDomPos);
};

const goToSlide = (target) => {
  if (target === slideCounter || isAnimating) {
    return;
  }

  slideCounter = target;
  setPosition(domPosition(target));
  updatePaginationButton();
};

const initTransitionEnd = () => {
  sliderListNode.addEventListener('transitionend', (evt) => {
    if (evt.target !== sliderListNode || evt.propertyName !== 'left') {
      return;
    }

    if (pendingTargetReal === null) {
      return;
    }

    const lastReal = realSlidesCount - 1;

    if (pendingTargetDomPos === realSlidesCount + 1) {
      setPosition(domPosition(0), true);
    }

    if (pendingTargetDomPos === 0) {
      setPosition(domPosition(lastReal), true);
    }

    slideCounter = pendingTargetReal;
    updatePaginationButton();

    pendingTargetReal = null;
    pendingTargetDomPos = null;
    isAnimating = false;
  });
};

const setPagination = () => {
  if (!paginationNode) {
    return;
  }

  paginationNode.innerHTML = '';

  for (let i = 0; i < realSlidesCount; i += 1) {
    const bulletNode = createBulletNode(i);

    paginationNode.append(bulletNode);
  }

  paginationNode.addEventListener('click', (evt) => {
    const bulletNode = evt.target.closest('.favourites-coffee__pagination-button');

    if (!bulletNode) {
      return;
    }

    const index = Number(bulletNode.dataset.index);

    if (!Number.isNaN(index)) {
      goToSlide(index);
    }
  });

  paginationNode.addEventListener('animationend', (evt) => {
    const loader = evt.target.closest('.favourites-coffee__pagination-loader');

    if (!loader) {
      return;
    }

    onSlideChangeNext();
  });
};

// Init swipe

let x1 = null;
let x2 = null;

const onTouchStart = (evt) => {
  x1 = evt.touches[0].clientX;
};

const onTouchMove = (evt) => {
  if (!x1) {
    return false;
  }
  x2 = evt.touches[0].clientX;
  const xDifference = x2 - x1;

  if (Math.abs(xDifference) < CONFIG.swipeThreshold) {
    return false;
  }

  if (xDifference > 0) {
    onSlideChangePrev();
  } else {
    onSlideChangeNext();
  }

  x1 = null;
};

const onMouseDown = (evt) => {
  if (set_slider_mobileMediaQuery.matches) {
    x1 = evt.clientX;
  }
};

const onMouseMove = (evt) => {
  if (!set_slider_mobileMediaQuery.matches || !x1) {
    return;
  }

  x2 = evt.clientX;
  const xDifference = x2 - x1;

  if (xDifference > 0) {
    onSlideChangePrev();
  } else {
    onSlideChangeNext();
  }

  x1 = null;
};

const setSliderEventListeners = () => {
  sliderListNode.addEventListener('mouseover', (evt) => {
    onHover(evt, 'pause');
  });

  sliderListNode.addEventListener('mouseout', (evt) => {
    onHover(evt, 'resume');
  });

  sliderListNode.addEventListener('touchstart', (evt) => {
    if (evt.target.closest('.favourites-coffee__card')) {
      pauseLoader();
    }
  }, {passive: true});

  sliderListNode.addEventListener('touchend', (evt) => {
    if (evt.target.closest('.favourites-coffee__card')) {
      resumeLoader();
    }
  }, {passive: true});

  sliderNode.addEventListener('touchstart', onTouchStart, false);
  sliderNode.addEventListener('touchmove', onTouchMove, false);
  sliderNode.addEventListener('mousedown', onMouseDown, false);
  sliderNode.addEventListener('mousemove', onMouseMove, false);
};

const startAutoplay = () => {
  slideCounter = 0;
  setPosition(domPosition(0), true);
};

// Set slider
const setSlider = () => {
  if (!sliderNode || !sliderListNode || !realSlidesCount) {
    return;
  }

  setPagination();
  addCloneSlides();
  setSliderEventListeners();
  initTransitionEnd();
  startAutoplay();

  if (sliderButtonNextNode) {
    sliderButtonNextNode.addEventListener('click', onSlideChangeNext);
  }

  if (sliderButtonPrevNode) {
    sliderButtonPrevNode.addEventListener('click', onSlideChangePrev);
  }

  set_slider_mobileMediaQuery.addEventListener('change', () => setPosition(domPosition(slideCounter), true));
};



;// ./source/js/index.js







document.addEventListener('DOMContentLoaded', () => {
  setTheme();
  setMenu();
  setLoadButton();
  setCatalogFilter();
  setSlider();
});

/******/ })()
;
//# sourceMappingURL=main.js.map