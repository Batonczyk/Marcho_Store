const searchInput = document.querySelector('.search-box__inner');
const btnSearch = document.querySelector('[data-search]');
const searchBox = document.querySelector('.search-box');
const searchResult = document.querySelector('.search-box__result');
console.log(btnSearch);
btnSearch.addEventListener('click', function (e) {
    e.preventDefault();
    searchBox.classList.toggle('active-search');
})
async function getProduct() {
    const productApi = await fetch('https://fakestoreapi.com/products');
    const response = await productApi.json();
    return response.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description
    }));
}

searchInput.addEventListener('input', async function () {
    if (this.value.trim() !== '') {
        const searchResult = await getProduct();
        const productSearch = searchResult.filter((item) => {
         const inTitle = item.title.toLowerCase().includes(this.value);
         const inDescr = item.description.toLowerCase().includes(this.value);
         return inTitle || inDescr;
        });
        displayResult(productSearch)
    }else{
        searchResult.innerHTML = ''; 
    }
    if (this.value.trim() === '') {
        searchResult.classList.add('active-search');
    } else {
        searchResult.classList.remove('active-search');
    }
})

function displayResult(result) {
    const searchResult = document.querySelector('.search-box__result');
    searchResult.innerHTML = '';
    const resultSearch = result.map((product) => `
    <a class="menu__user-link" href="#">
        <li class="search-box__item">
            <img  class="search-box__img" src="${product.image}" alt="">
            <p class="search-box__description">${product.title}</p>
            <span class="search-box__price">$${product.price}</span>
        </li>
        </a>
    `).join('');

    searchResult.innerHTML += resultSearch;
}