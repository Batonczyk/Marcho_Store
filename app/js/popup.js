const overlay = document.querySelector('.overlay'),
    popupWindow = document.querySelector('.popup'),
    closeBtn = document.querySelector('.close'),
    playBtn = document.querySelector('.fasion__item'),
    frame = document.querySelector('.popup__frame');
let scrollPosition = 0;


function playVideo() {
    popupWindow.classList.remove('active-popup');
    overlay.style.display = 'block';
    frame.setAttribute('src', '//www.youtube.com/embed?v=ShjzEckueZU&list=PL0cA19vPhtoXfSpSGq4Hi00YGRaRKBSMS&index=3');
}

playBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target === playBtn) {
        playVideo();
        scrollFixed()
    }
});

function closePopup() {
    popupWindow.classList.add('active-popup');
    overlay.style.display = 'none';
    frame.setAttribute('src', '');
    scrollEnable();
}

closeBtn.addEventListener('click', closePopup);

window.onclick = function (e) {
    if (e.target.classList.contains('overlay')) {
        popupWindow.classList.add('active-popup');
        overlay.style.display = 'none';
        frame.setAttribute('src', '');
        scrollEnable()
    }
}

function scrollFixed() {
    scrollPosition = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.top = -scrollPosition + "px";
}

function scrollEnable() {
    // enable fixed position page
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, scrollPosition);
}

export { playVideo, playBtn, closeBtn, closePopup, scrollEnable, scrollFixed }