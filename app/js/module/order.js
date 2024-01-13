const orderContainer = document.querySelector('.order__ordering');
const orderInner = document.querySelector('.order-form__order');
const confirmBtn = document.querySelector('.order-form__submit');
const amountElement = document.querySelector('td b[data-price]');
const deliveryElement = document.querySelector('td[data-deliv]');
const order = document.querySelector('.order');
const localStor = localStorage;

if (orderContainer) {
    orderContainer.addEventListener('click', removeItem);
    confirmBtn.addEventListener('click', postForm);
    function getDataForLocalS(localStorageData, containerData) {
        const getKeyLocal = localStorageData.getItem('cart');
        const cost = document.querySelector('td b[data-count]');
        if (getKeyLocal) {
            const parseData = JSON.parse(getKeyLocal);
            cost.textContent = parseData.length;
            parseData.forEach((data) => {
                addOrderData(containerData, data);
            });
        }
        updateCartCounter();
    }

    function addOrderData(container, product) {
        if (!container) {
            console.error('Container element not found.');
            return;
        }
        const itemHtml = `
            <li class="order-form__product" data-id="${product.id}">
                <img class="order-form__images" src="${product.imgSrc}" alt="photo 1">
                <p class="order-form__info">${product.title}</p>
                <span class="order-form__price">${product.price}</span>
                <button class="order-form__remove">Delete</button>
            </li>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    }

    function removeItem(e) {
        const target = e.target;
        console.log(target)
        const btnRemove = target.classList.contains('order-form__remove');
        console.log(btnRemove)
        if (btnRemove) {
            const item = target.closest('.order-form__product');
            console.log(item)
            const productId = item.dataset.id;

            removeStorageItem(productId);
            removeProductFromUI(item);
        }
    }

    function removeStorageItem(productId) {
        const getStorage = JSON.parse(localStor.getItem('cart')) || [];
        const countCart = JSON.parse(localStor.getItem('countCart'));
        console.log(countCart)
        const findStorageIndex = getStorage.findIndex(product => product.id === productId);

        if (findStorageIndex !== -1) {
            getStorage.splice(findStorageIndex, 1);
            localStor.setItem('cart', JSON.stringify(getStorage));
            localStor.setItem('countCart', countCart - 1);
            calcCartPrice('td b[data-price]');
        }
    }

    function removeProductFromUI(productItem) {
        productItem.remove();
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

    async function postForm(e) {
        e.preventDefault();
        const form = e.target.closest('.order-form');
        const getStorage = JSON.parse(localStor.getItem('cart')) || [];
        console.log(getStorage)
        const formData = new FormData(form);
        formData.append('order', JSON.stringify(getStorage));
        const arrFormData = {};

        getStorage.forEach((data, index) => {
            console.log(data)
            const storageKey = `storageData_${index + 1}`;
            arrFormData[storageKey] = data;
        });

        formData.forEach((value, key) => {
            console.log(key, value);
            arrFormData[key] = value.toString().trim().replace(/\s+/g, ' ');
        });
        console.log(arrFormData)
        const validateForm = validateFordErr(arrFormData);
        displayErrors(validateForm);
        if (validateForm.length > 0) return;
        sendForm(form, confirmBtn, arrFormData);
    }

    async function sendForm(form, formBtn, formDataObj) {
        try {
            formBtn.textContent = 'Loading...'
            formBtn.disabled = true;
            const response = await fetch('http://localhost:5000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObj)
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            } else {
                alert('Thank you, we will contact you in the near future!');
                localStorage.clear();
                form.reset()
            }
            if (response.status === 422) {
                const errors = await response.json();
                console.log(errors)
                throw new Error('Errors validacion data');
            } else {
                throw new Error(response.statusText);
            }

        } catch (err) {
            console.error(err);
            alert('The form has not been sent!');
        } finally {
            formBtn.textContent = 'Confirm';
            formBtn.disabled = false;
        }

    }

    function displayErrors(err) {
        const errElem = document.querySelectorAll('.order-form__errors');
        console.log(errElem)
        errElem.forEach((errElements) => {
            errElements.textContent = '';
        });

        if (err.length < 1) return;

        err.forEach((errors) => {
            const { field, message } = errors;
            console.log(message)
            const elementErr = document.querySelector(`[data-for="${field}"]`);
            elementErr.textContent = message;
        });
    }

    function freeDelivery(amount, delivery) {
        const numberText = parseFloat(amount.textContent.slice(1))
        if (!isNaN(numberText) && numberText >= 100) {
            delivery.style.color = 'green';
            delivery.textContent = 'Yes'
        } else {
            delivery.style.color = '#fc4103';
            delivery.textContent = 'No'
        }
    }

    function validateFordErr(formData) {
        const { name, surname, email, phone, postid } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[+]?\d{1,3}?[-. ]?\(?\d{1,3}?\)?[-. ]?\d{1,4}[-. ]?\d{1,4}$/;
        const usZipCodeRegex = /^\d{2}(-\d{3})?$/;
        const errors = [];
        if (!name) {
            errors.push({ field: 'name', message: 'Please write your name.' });
        } else if (name.length < 2 || name.length > 20) {
            errors.push({ field: 'name', message: 'Please, write correctly data. Example: John' });
        }

        if (!surname) {
            errors.push({ field: 'surname', message: 'Please write your Surname.' });
        } else if (surname.length < 5 || surname.length > 20) {
            errors.push({ field: 'surname', message: 'Please, write correctly data. Example: Wasowski' });
        }

        if (!email) {
            errors.push({ field: 'email', message: 'Please write your email.' });
        } else if (!emailRegex.test(email) || (email.length < 5 || email.length > 100)) {
            errors.push({ field: 'email', message: 'Please, write correctly data. Example: example@gmail.com' });
        }

        if (!phone) {
            errors.push({ field: 'phone', message: 'Please write your phone.' });
        } else if (!mobileRegex.test(phone)) {
            errors.push({ field: 'phone', message: 'Please, write correctly data. Example: +48500322455' });
        }

        if (!postid) {
            errors.push({ field: 'postid', message: 'Please write your postcode.' });
        } else if (!usZipCodeRegex.test(postid) || (postid.length < 4 || postid.length > 6)) {
            errors.push({ field: 'postid', message: 'Please, write correctly data. Example: 45-322' });
        }
        return errors;
    }
    dataOrder('[data-country]');
    calcCartPrice('td b[data-price]');
    getDataForLocalS(localStor, orderContainer);
    freeDelivery(amountElement, deliveryElement);
}
