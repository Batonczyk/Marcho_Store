// export default class Slider {
//     constructor() {
//         this.settings = {
//             dots: true,
//             autoplay: false,
//         };

//         this.slideBox = document.querySelector('.top-slider__box');
//         this.slideInner = document.querySelector('.top-slider__inner');
//         this.slides = document.querySelectorAll('.top-slider__item');
//         this.slidesLength = this.slides.length;
//         this.slideWidth = this.slideInner.clientWidth;
//         this.firstElem = this.slides[0];
//         this.lastElem = this.slides[this.slides.length - 1];
//         this.position = -this.slideWidth;

//         if (this.settings.dots) {
//             this.slideDotes();
//         }
//         if (this.settings.autoplay) {
//             this.autoPlay();
//         }

//     }
//     infinityEffect() {
//         this.slideInner.addEventListener('transitionend', () => {
//             // Usuń pierwszy slajd, który znajduje się teraz na początku
//             this.slideInner.removeChild(this.slides[0]);
            
//             // Przesuń wewnętrzną listę w poziomie o szerokość slajdu
//             this.position -= this.slideWidth;
    
//             // Usuwamy animację przejścia
//             this.slideInner.style.transition = 'none';
    
//             // Przenosimy ostatni slajd (który stał się pierwszym) na początek
//             this.slideInner.insertBefore(this.slides[this.slidesLength - 1].cloneNode(true), this.slides[0]);
    
//             // Aktualizujemy pozycję, aby zmiany były widoczne
//             this.updatePosition();
//             console.log(this);
//         });
//     }
    
    

//     updatePosition() {
//         this.slideInner.style.transform = `translateX(${this.position}px)`;
//     }

//     slideDotes() {
//         const boxDots = document.createElement('ul');
//         boxDots.classList.add('dots');
//         this.slides.forEach((dots, index) => {
//             const dot = document.createElement('li');
//             dot.classList.add('dot');
//             dot.setAttribute('data-slideindex', index);
//             boxDots.append(dot);
//         });

//         this.slideBox.append(boxDots);
//         const dotsClick = document.querySelectorAll('.dot');
//         dotsClick.forEach((elem) => {
//             elem.addEventListener('click', () => {
//                 const indexDots = elem.getAttribute('data-slideindex');
//                 this.position = -indexDots * this.slideWidth;
//                 this.updatePosition()
//             });
//         });
//     }

//     autoPlay() {
//         setInterval(() => {
//             this.position -= this.slideWidth;
//             this.infinityEffect()
//             this.updatePosition()
//         }, 3000);
//     }
// }
