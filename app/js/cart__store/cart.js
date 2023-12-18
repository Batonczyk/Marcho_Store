const navBar = document.querySelector('.menu__user'),
    navChilds = [...navBar.children],
    navCart = navChilds[navChilds.length - 2],
    cartBtn = navChilds[navChilds.length - 1],
    cartWrapper = document.querySelector('.cart__inner'),
    numCount = document.querySelector('[data-count]');
console.log(numCount)
let cart = [];
let count = 0;
navCart.addEventListener('click', () => {
    cartBtn.classList.toggle('active-cart');
    if (!navCart) {
        cartBtn.classList.remove('active-cart')
    }
});

function updateCartCounter() {
    numCount.innerHTML = count;
}

function addToCart(cartInner) {
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-btn]')
        if (btn) {
            e.preventDefault();
            const card = btn.closest('.product-item');
            console.log(e.target, card)
            const productInfo = {
                id: card.dataset.cart,
                imgSrc: card.querySelector('.product-item__images').getAttribute('src'),
                title: card.querySelector('.product-item__title').textContent,
                price: card.querySelector('.product-item__new').innerHTML,
            };
            console.log(productInfo)
            const cartItemHtml = `
            <li class="cart__item">
            <img class="cart__img" src="${productInfo.imgSrc}" alt="nothing">
            <div class="cart-counter">
            <button class="cart-counter__plus" type="button">+</button>
            <span class="cart-counter__count">1</span>
            <button class="cart-counter__minus" type="button">-</button>
            </div>
            <p class="cart__info">
             ${productInfo.title}
            </p>
            <p class="cart__amount">${productInfo.price}</p>
            </li>`
            cartInner.insertAdjacentHTML('beforeend', cartItemHtml);
            cart.push(productInfo);
            count++
            saveProductLocal()
            updateCartCounter()
        }
    })
}

function saveProductLocal() {
    localStorage.setItem('cart', JSON.stringify(cart))
    localStorage.setItem('countCart', count)
}

function loadCart(cartInner) {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    count = JSON.parse(localStorage.getItem('countCart')) || 0;
    console.log(cart);
    for (let key in cart) {
        console.log(cart[key])
        if (!cart[key]) {
            return
        } else {
            const cartItemHtml = `
            <li class="cart__item">
            <img class="cart__img" src="${cart[key].imgSrc}" alt="nothing">
            <div class="cart-counter">
            <button class="cart-counter__plus" type="button">+</button>
            <span class="cart-counter__count">1</span>
            <button class="cart-counter__minus" type="button">-</button>
            </div>
            <p class="cart__info">
             ${cart[key].title}
            </p>
            <p class="cart__amount">${cart[key].price}</p>
            </li>`
            cartInner.insertAdjacentHTML('beforeend', cartItemHtml);
        }
        numCount.innerHTML = count;
    }
    updateCartCounter()
}

if (localStorage.getItem('cart') != null) {
    loadCart(cartWrapper);
}

addToCart(cartWrapper);
// loadCart(cartWrapper);
export { navCart, addToCart }