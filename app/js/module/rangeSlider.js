window.addEventListener('load', () => {
    const slideOne = document.querySelector('[data-slide-one]');
    const slideTwo = document.querySelector('[data-slide-two]');
    const priceMin = document.querySelector('[data-price-min]');
    const priceMax = document.querySelector('[data-price-max]');
    let minGap = 0;

    slideOne.addEventListener('input', () => {
        if (parseFloat(slideTwo.value) - parseFloat(slideOne.value) <= minGap) {
            slideOne.value = parseFloat(slideTwo.value) - minGap;
        }
        priceMin.textContent = `$${slideOne.value}`;
        colorLineSlider();
    });

    slideTwo.addEventListener('input', () => {
        if (parseFloat(slideTwo.value) - parseFloat(slideOne.value) <= minGap) {
            slideOne.value = parseFloat(slideTwo.value) + minGap;
        }
        priceMax.textContent = `$${slideTwo.value}`;
        colorLineSlider();
    });

    colorLineSlider();
});

function colorLineSlider() {
    const slideOne = document.querySelector('[data-slide-one]');
    const slideTwo = document.querySelector('[data-slide-two]');
    const slideTrack = document.querySelector('.filter-price__track');
    const maxValue = parseFloat(slideOne.max);

    const parcOne = (slideOne.value / maxValue) * 100;
    const parcTwo = (slideTwo.value / maxValue) * 100;
    slideTrack.style.background = `linear-gradient(to right, #ececec ${parcOne}% , #fe3e57 ${parcOne}% , #fe3e57 ${parcTwo}%, #ececec ${parcTwo}%)`;
}
