// import Slider from './Slider.js';
import { boxSlider, slides, slidesContainer, createDots, startAutoSlide } from './Sliderv2.js';
import { playVideo, playBtn, closeBtn, closePopup, scrollEnable, scrollFixed } from './popup.js';
import { spinerAnimation } from './card.js';
import { activeStars } from './star__rating/star.js';
createDots(boxSlider, slides)
startAutoSlide()
activeStars('.product-item__star');