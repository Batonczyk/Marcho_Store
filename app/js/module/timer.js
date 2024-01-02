function initTimer() {
    let timeInterval;
    function getTimer(time) {
        const total = Date.parse(time) - Date.parse(new Date()),
            days = Math.floor(total / (1000 * 60 * 60 * 24)),
            hours = Math.floor(total / (1000 * 60 * 60) % 24),
            minutes = Math.floor(total / (1000 * 60) % 60),
            seconds = Math.floor((total / 1000) % 60);
        return {
            days, hours, minutes, seconds, total
        };
    }

    function initialized(clas, time) {
        const items = document.querySelectorAll('.timer__box'),
            textClock = document.querySelectorAll('.timer__box span'),
            days = document.querySelector('.days'),
            hours = document.querySelector('.hours'),
            minutes = document.querySelector('.minutes'),
            seconds = document.querySelector('.seconds');
        function clockUpdate() {
            const timeInit = getTimer(time);
            days.innerHTML = timeInit.days,
                hours.innerHTML = (`0${timeInit.hours}`).slice(-2),
                minutes.innerHTML = (`0${timeInit.minutes}`).slice(-2),
                seconds.innerHTML = (`0${timeInit.seconds}`).slice(-2);
            if (timeInit.days <= 1) {
                items.forEach((item) => {
                    item.classList.add('attention');
                    textClock.forEach((colortext) => {
                        colortext.style.color = '#fff';
                    });
                });
            }
            if (timeInit.total <= 0) {
                clearInterval(timeInterval);
            }
        }
        clockUpdate();
        timeInterval = setInterval(clockUpdate, 1000);
    }
    return { initialized, getTimer };
}
const timerModule = initTimer();
const deadline = document.querySelector('.promo__timer').getAttribute('data-time');
timerModule.initialized('.promo__timer', deadline);