const boxSlider = document.querySelector('.top-slider__box');
const slidesContainer = document.querySelector('.top-slider__inner');
const slideWidth = slidesContainer.clientWidth
let slides = [...slidesContainer.children];
console.log(slides.length)
const firstCloneSlide = slides[0].cloneNode(true),
    lastClonedSlide = slides[slides.length - 1].cloneNode(true);
    firstCloneSlide.classList.add('clonefirst'),
    lastClonedSlide.classList.add('clonelast');
    slidesContainer.append(firstCloneSlide),
    slidesContainer.prepend(lastClonedSlide);
    slidesContainer.style.transform = `translateX(-${slideWidth}px)`;
let ind = 1;
let position;
console.log(slides)

const settingsSlider = {
    autoslide: false,
    interval: 4000,
}
// Creating dots in carousel slider
const createDots = (slider, init) => {
    const container = document.createElement('ul');
    container.classList.add('dots');
    init.forEach((slide, index) => {
        const dot = document.createElement('li');
        dot.classList.add('dot');
        if (index === 0) {
            dot.classList.add('active-dots'); // Add 'active-dots' to the first dot
        }
        dot.addEventListener('click', () => {
            const dots = container.querySelectorAll('.dot');
            dots.forEach(elem => elem.classList.remove('active-dots'));
            dot.classList.add('active-dots');
            ind = index + 1;
            slidesContainer.style.transition = "all 0.5s linear";
            slidesContainer.style.transform = `translateX(-${slideWidth * ind}px)`
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
function nextSlide() {
    if (ind >= slides.length - 1) return;
    ind++;
    updateDostsPosition()
    updateSlidePosition()
}

function prevSlide() {
    if (ind <= 0) return;
    updateSlidePosition()
}

function updateDostsPosition() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active-dots');
        if (index === ind - 1) {
            dot.classList.add('active-dots');
        }
    })
}
slidesContainer.addEventListener('transitionend', function () {
    slides = newCloneNideList();
    if (slides[ind].classList.contains('clonefirst')) {
        slidesContainer.style.transition = 'none';
        ind = 1;
        slidesContainer.style.transform = `translateX(-${slideWidth * ind}px)`;
    }
    if (slides[ind].classList.contains('clonelast')) {
        slidesContainer.style.transition = 'none';
        ind = slides.length - 2;
        slidesContainer.style.transform = `translateX(-${slideWidth * ind}px)`;
    }
});

function updateSlidePosition() {
    slidesContainer.style.transition = 'all 0.5s linear';
    slidesContainer.style.transform = `translateX(-${slideWidth * ind}px)`;
}

boxSlider.addEventListener('mouseenter', function () {
    clearInterval(position);
})
boxSlider.addEventListener('mouseleave', startAutoSlide);
function resize() { // adaptive slider size
    slidesContainer.style.width = slideWidth * `${slides.length}px`;
    slides.forEach((elem) => {
        elem.style.width = `${slideWidth}px`;
        elem.style.height = 'auto';
    });
}
window.addEventListener('resize', resize);
createDots(boxSlider, slides);
startAutoSlide();