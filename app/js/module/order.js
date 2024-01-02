const confirmBtn = document.querySelector('.order-form__submit');
const orderContainer = document.querySelector('.order-form__order');
const order = document.querySelector('.order');
const orderForm = document.querySelector('.order-form');
const localStor = localStorage;

if (orderContainer) {
    confirmBtn.addEventListener('click', postForm);
    // Проверяем, находимся ли мы на странице с формой заказа
    function getDataForLocalS(localStorageData, containerData) {
        const getKeyLocal = localStorageData.getItem('cart');
        const cost = document.querySelector('td b[data-count]');
        if (getKeyLocal) {
            const parseData = JSON.parse(getKeyLocal);
            cost.textContent = parseData.length;
            console.log(parseData)
            parseData.forEach((data) => {
                console.log(data.length);
                addOrderData(containerData, data);
            });
        }
        updateCartCounter();
    }

    function addOrderData(container, product) {
        // Проверяем существование элемента container перед использованием
        if (!container) {
            console.error('Container element not found.');
            return;
        }
        const itemHtml = `
            <li class="order-form__product">
                <img class="order-form__images" src="${product.imgSrc}" alt="photo 1">
                <p class="order-form__info">${product.title}</p>
                <span class="order-form__price">${product.price}</span>
                <button class="order-form__remove">Delete</button>
            </li>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    }

    async function dataOrder(country) {
        const selectCountry = document.querySelector(country);
        const dataSelect = await fetch(' https://restcountries.com/v3.1/all?fields=name,flags');
        const responseData = await dataSelect.json();
        const namesArr = responseData.map((entry) => entry.name.official);
        const sortedName = namesArr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        for (let countryName of sortedName) {
            const optionSelect = document.createElement('option');
            optionSelect.textContent += countryName;
            selectCountry.append(optionSelect);
        }
    }

    async function postForm() {
        const getStorage = JSON.parse(localStor.getItem('cart')) || [];
        const form = new FormData(orderForm);
        form.append('cart', JSON.stringify(getStorage))
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: form
            })
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            alert(data.response);
            localStorage.removeItem('cart');
            localStorage.removeItem('countCart');
        } catch (err) {
            console.error(err)
        }
    }
    dataOrder('[data-country]');
    calcCartPrice('td b[data-price]');
    getDataForLocalS(localStor, orderContainer);

}
