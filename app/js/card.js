const productList = document.querySelector('.product__items');
const productItem = [...productList.children];
const spinerAnimation = document.querySelector('.product__more'),
    spinner = '<span class="spinner"></span>';
console.log(productItem);
let countCard = 0;

spinerAnimation.addEventListener('click', async function (e) {
    e.preventDefault();
    spinerAnimation.disabled = true;
    if (!this.classList.contains('spinner')) {
        this.classList.add('spinner');
        this.innerHTML = spinner;
        try {
            const dataCardInfo = await fetch('https://fakestoreapi.com/products');
            const response = await dataCardInfo.json();
            console.log(response)
            for (let i = countCard; i < countCard + 3 && i < response.length; i++) {
                const newCard = createCard(response[i]);
                productList.appendChild(newCard)
            }
            countCard += 3;
        } catch (err) {
            console.error(`errrrrrrrrrr ${err}`);
        } finally {
            this.classList.remove('spinner');
            this.innerHTML = 'LOAD MORE';
            spinerAnimation.disabled = false;
        }
    }
})
function createCard(cardStore) {
    const card = document.createElement('li');
    card.className = 'product-item';
    if (cardStore) {
        // console.log(cardStore)
        const generateStar = starRatingGenerate(cardStore.rating.rate);
        const generationCardLayout = `
        <div class="product-item__img-box">
        <img class="product-item__images" src="${cardStore.image}" alt="product 1">
        <div class="product-item__box">
            <a class="product-item__link" href="#">
                <svg class="product-item__icon" fill="none">
                    <use xlink:href="images/sprite.svg#search"></use>
                </svg>
            </a>
            <a class="product-item__link product-item__link--line" href="#">
                <svg class="product-item__icon" fill="none">
                    <use xlink:href="images/sprite.svg#bag"></use>
                </svg>
            </a>
            <a class="product-item__link" href="#">
                <svg class="product-item__icon" fill="none">
                    <use xlink:href="images/sprite.svg#heart"></use>
                </svg>
            </a>
        </div>
    </div>
    <div class="product-item__star">${generateStar}</div>
    <h4 class="product-item__title">
        ${cardStore.title}
    </h4>
    <ul class="product-item__price">
        <li class="product-item__new">$${cardStore.price}</li>
        <li class="product-item__old">$27.00</li>
    </ul>
        `
        card.innerHTML = generationCardLayout;
    }
    return card
    function starRatingGenerate(rating) {
        const fullStars = Math.floor(rating);
        console.log(fullStars)
        const halfStar = Math.ceil(rating - fullStars);
        console.log(halfStar)
        let starLine = '';
        for (let i = 1; i < fullStars; i++) {
            starLine += `<span class="star" data-index="5">
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path opacity="1" fill="#1E3050" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
            </span>`
        }
        if (halfStar > 0) {
            starLine += `<span class="star" data-index="5">
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path opacity="1" fill="#1E3050" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
            </span>`
        }
        return starLine;
    }

}
export {spinerAnimation }

