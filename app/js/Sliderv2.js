const boxSlider = document.querySelector('.top-slider__box');
const slidesContainer = document.querySelector('.top-slider__inner');
const slideWidth = slidesContainer.clientWidth
let slides = [...slidesContainer.children];
const firstCloneSlide = slides[0].cloneNode(true),
    lastClonedSlide = slides[slides.length - 1].cloneNode(true);
firstCloneSlide.classList.add('clonefirst'),
    lastClonedSlide.classList.add('clonelast');
slidesContainer.append(firstCloneSlide),
    slidesContainer.prepend(lastClonedSlide);
slidesContainer.style.transform = `translateX(-${slideWidth}px)`;
let index = 1;
let position;
console.log(slides)

const settingsSlider = {
    autoslide: true,
    interval: 5000,
}
// Creating dots in carousel slider
const createDots = (slider, init) => {
    const container = document.createElement('ul');
    container.classList.add('dots');
    init.forEach((slide, index) => {
        const dot = document.createElement('li');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            slidesContainer.style.transform = `translateX(-${index * slideWidth}px)`
        })
        container.appendChild(dot)
    });
    slider.appendChild(container);
    return container
}

const startAutoSlide = () => {
    if (settingsSlider.autoslide) {
        position = setInterval(nextSlide, settingsSlider.interval);
    }
}

const newCloneNideList = () => [...slidesContainer.children];
console.log(newCloneNideList())
function nextSlide() {
    if (index >= slides.length - 1) return;
    index++;
    slidesContainer.style.transition = "all 0.5s linear";
    slidesContainer.style.transform = `translateX(-${slideWidth * index}px)`;
}

function prevSlide() {
    if (index <= 0) return;
    index--;
    slidesContainer.style.transform = `translateX(-${slideWidth * index}px)`;
}
slidesContainer.addEventListener('transitionend', function () {
    slides = newCloneNideList();
    if (slides[index].classList.contains('clonefirst')) {
        slidesContainer.style.transition = 'none';
        index = 1;
        slidesContainer.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if (slides[index].classList.contains('clonelast')) {
        slidesContainer.style.transition = 'none';
        index = slides.length - 2;
        slidesContainer.style.transform = `translateX(-${slideWidth * index}px)`;
    }
});

boxSlider.addEventListener('mouseenter', function () {
    clearInterval(position);
})
boxSlider.addEventListener('mouseleave', startAutoSlide)
export { boxSlider, slides, slidesContainer, createDots, startAutoSlide }