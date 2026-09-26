export class ProductCard {
  constructor({name, id, description, price, category, imageName}) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.price = price;
    this.category = category;
    this.imageName = imageName;
  }

  createNode(tag, text, className) {
    const node = document.createElement(tag);

    if (text !== null) {
      node.textContent = text;
    }

    if (className) {
      node.className = className;
    }

    return node;
  }

  createImage() {
    const wrapperNode = this.createNode('div', null, 'catalog__image-wrapper');

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
    const productCard = this.createNode('li', null, 'catalog__item');
    productCard.dataset.id = this.id;
    productCard.dataset.filter = this.category;

    if (this.imageName) {
      const imageWrapperNode = this.createImage();
      productCard.append(imageWrapperNode);
    }

    if (this.name || this.description || this.price) {
      const textNode = this.createNode('div', null, 'catalog__item-text');

      if (this.name) {
        const nameNode = this.createNode('h3', this.name);
        textNode.append(nameNode);
      }

      if (this.description) {
        const descriptionNode = this.createNode('p', this.description);
        textNode.append(descriptionNode);
      }

      if (this.price) {
        const priceNode = this.createNode('span', `$${this.price}`);
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

const setProductCards = (data, targetFilter) => {
  if (!data.length) {
    return;
  }

  const productCardsContainer = document.querySelector('.catalog__list');

  if (productCardsContainer) {
    productCardsContainer.innerHTML = '';
    productCardsContainer.append(generateProductCards(data, targetFilter));
  }
};

export {setProductCards};
