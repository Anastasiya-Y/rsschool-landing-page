import info from '../data/products.json';

const data = info;

export class ProductCard {
    constructor ({name, id, description, price, category, imageName, ...rest}) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageName = imageName;
    }

    createProductCard() {
        let template = '';
        let productCard = document.createElement('li');
        productCard.className = 'catalog__item';
        productCard.setAttribute('data-id', this.id);
        productCard.setAttribute('data-filter', this.category);

        if (this.imageName) {
            template += '<div class="catalog__image-wrapper">'
                template += `<img src="img/content/catalog/${this.imageName}" width="310" height="310" alt="Photos of ${this.name}.">`
            template += '</div>'
        }

        if (this.name || this.description || this.price) {
            template += '<div class="catalog__item-text">'
                if (this.name) {
                    template += `<h3>${this.name}</h3>`
                }

                if (this.description) {
                    template += `<p>${this.description}</p>`
                }

                if (this.price) {
                    template += `<span>$${this.price}</span>`
                }
            template += '</div>'
        }

        productCard.innerHTML = template;

        return productCard;
    }
}

const generateProductCards = (data) => {
    let productCards = [];
    data.forEach((item) => {
      console.log(item)
        productCards.push(new ProductCard(item));
    })
    return productCards;
}

const setProductCards = () => {
    if (data) {
        const productCardsContainer = document.querySelector('.catalog__list');

        if (productCardsContainer) {
            productCardsContainer.innerHTML = '';
            generateProductCards(data).forEach((item) => {
                productCardsContainer.append(item.createProductCard());
            });
        }
    }
}

export {setProductCards};
