import { createNode, isEscapeKey } from '../utils/utils';

const DEFAULT_ADDITIONAL_PRICE = 0.5;
export class Modal {
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
