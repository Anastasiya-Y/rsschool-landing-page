import {createNode} from '../utils/utils';

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

const mobileMediaQuery = window.matchMedia('(max-width: 767px)');

const realSlideNodes = (sliderListNode && [...sliderListNode.children]) || [];
const realSlidesCount = realSlideNodes.length;

let activeBulletNode = null;
let slideCounter = 0;
let isAnimating = false;
let pendingTargetReal = null;
let pendingTargetDomPos = null;

const getStep = () =>
  mobileMediaQuery.matches ? CONFIG.mobile : CONFIG.desktop;

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
  if (mobileMediaQuery.matches) {
    x1 = evt.clientX;
  }
};

const onMouseMove = (evt) => {
  if (!mobileMediaQuery.matches || !x1) {
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

  mobileMediaQuery.addEventListener('change', () => setPosition(domPosition(slideCounter), true));
};

export {setSlider};
