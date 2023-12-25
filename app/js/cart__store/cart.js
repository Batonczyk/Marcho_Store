const navBar = document.querySelector('.menu__user'),
    navChilds = [...navBar.children],
    navCart = navChilds[navChilds.length - 2],
    cartBtn = navChilds[navChilds.length - 1],
    menuUserNum = document.querySelectorAll('.menu__user-num'),
    cartWrapper = document.querySelector('.cart__inner'),
    numCount = document.querySelector('[data-count]');

let cart = [];
let count = 0;

navCart.addEventListener('click', (e) => {
    e.stopPropagation();
    cartBtn.classList.toggle('active-cart');
});

document.addEventListener('click', function (e) {
    const isClick = cartWrapper.contains(e.target) || navCart.contains(e.target);
    if (!isClick && cartBtn.classList.contains('active-cart')) {
        cartBtn.classList.remove('active-cart');
    }
});

function styleMenuNav(span) {
    span.forEach((item) => {
        const textCount = parseInt(item.textContent);
        if (textCount < 1) {
            item.style.display = 'none';
        } else {
            item.style.display = 'block';
        }
    });
}

function addToCart(cartInner, productInfo) {
    const cartItemHtml = `
        <li class="cart__item" data-id="${productInfo.id}">
            <img class="cart__img" src="${productInfo.imgSrc}" alt="nothing">
            <div class="cart-counter">
                <button class="cart-counter__plus" type="button" data-plus>+</button>
                <span class="cart-counter__count" data-counter>${productInfo.quantity}</span>
                <button class="cart-counter__minus" type="button" data-minus>-</button>
            </div>
            <p class="cart__info">${productInfo.title}</p>
            <p class="cart__amount">${productInfo.price}</p>
        </li>`;

    cartInner.insertAdjacentHTML('beforeend', cartItemHtml);
}

function updateCartItem(cartItem) {
    const cartItemElement = document.querySelector(`.cart__item[data-id="${cartItem.id}"]`);
    const counterElement = cartItemElement.querySelector('[data-counter]');
    counterElement.textContent = cartItem.quantity;
}

function updateCartCounter() {
    numCount.innerHTML = count;
    styleMenuNav(menuUserNum)
    saveProductLocal()
}

function saveProductLocal() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('countCart', count);
}

function loadCart(cartInner) {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    count = JSON.parse(localStorage.getItem('countCart')) || 0;

    for (let key in cart) {
        addToCart(cartInner, cart[key]);
    }

    updateCartCounter();
    calcCartPrice()
}

function calcCartPrice() {
    let total = 0;
    const cartItem = document.querySelectorAll('.cart__item');
    const totalPrice = document.querySelector('[data-price]')
    if (!totalPrice) {
        console.error('Element not found');
        return
    }
    cartItem.forEach((item) => {
        const amount = parseInt(item.querySelector('[data-counter]').textContent);
        const newPrice = parseInt(item.querySelector('.cart__amount').textContent.slice(1));
        const stringPrice = parseFloat(newPrice)
        if (!isNaN(stringPrice)) {
            const currentPrice = amount * newPrice;
            total += currentPrice;
        }
    });
    totalPrice.textContent = `$${total}`;
}

function clearAll() {
    const clearBtn = document.querySelector('.cart__clear');
    clearBtn.addEventListener('click', () => {
        cart.splice(0, cart.length);
        count = 0;
        saveProductLocal();
        calcCartPrice();
        updateCartCounter()
    })
}
clearAll()
document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-btn]');
    const plusBtn = e.target.closest('[data-plus]');
    const minusBtn = e.target.closest('[data-minus]');
    if (btn) {
        e.preventDefault();
        const card = btn.closest('.product-item');
        const productId = card.dataset.cart;

        const existingCartItem = cart.find(item => item.id === productId);

        if (existingCartItem) {
            existingCartItem.quantity++;
            updateCartItem(existingCartItem);
        } else {
            const productInfo = {
                id: productId,
                imgSrc: card.querySelector('.product-item__images').getAttribute('src'),
                title: card.querySelector('.product-item__title').textContent,
                price: card.querySelector('.product-item__new').innerHTML,
                quantity: 1,
            };

            cart.push(productInfo);
            addToCart(cartWrapper, productInfo);
            styleMenuNav(menuUserNum);
            calcCartPrice()
        }

        count++;
        saveProductLocal();
        updateCartCounter();
    } else if (plusBtn || minusBtn) {
        const cartItem = e.target.closest('.cart__item');
        const counterCart = cartItem.querySelector('[data-counter]');
        const productId = cartItem.dataset.id;

        if (plusBtn) {
            const cartItemIndex = cart.findIndex(item => item.id === productId);
            if (cartItemIndex !== -1) {
                cart[cartItemIndex].quantity++;
                counterCart.textContent = cart[cartItemIndex].quantity;
                count++
            }
        } else if (minusBtn) {
            const cartItemIndex = cart.findIndex(item => item.id === productId);
            if (cartItemIndex !== -1 && cart[cartItemIndex].quantity > 1) {
                cart[cartItemIndex].quantity--;
                counterCart.textContent = cart[cartItemIndex].quantity;
                count--
            } else {
                cart.splice(cartItemIndex, 1);
                cartItem.remove();
                count--
                updateCartCounter();
            }
        }
        saveProductLocal();
        updateCartCounter();
        calcCartPrice()
    }
});
loadCart(cartWrapper);
styleMenuNav(menuUserNum);

export { navCart, addToCart }