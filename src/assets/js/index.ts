import "../styles/main.scss";

import Swiper, {
    Navigation,
    Pagination,
} from "swiper";

Swiper.use([Navigation, Pagination]);

import {gsap, TimelineMax} from "gsap";





let width = 530;
let height = 530;
let radius = width / 2;
let center = {
    x: width / 2,
    y: height / 2
};
let basePoints: any = [];
let sliders = [];
let numPoints = 0;
let dateStart = '';
let dateEnd = '';
let angleStep = (Math.PI * 2) / numPoints;
let angle;
let point;


// Цикл по всем блокам "Исторических дат"
document.querySelectorAll('.historical-dates').forEach(function (el, key) {
    // Количество узлов на диаграмме
    numPoints = el.querySelectorAll('.historical-dates__list-item').length;

    //Шаг между точек
    angleStep = (Math.PI * 2) / numPoints;

    // Массив узлов
    basePoints[key] = [];
    sliders[key] = [];

    // Получаем информацию по узлам в диаграмме
    el.querySelectorAll('.historical-dates__list-item').forEach(function (el, i) {

        dateStart = el.querySelector('.historical-dates__list-slider li:first-of-type .historical-dates__date').textContent;
        dateEnd = el.querySelector('.historical-dates__list-slider li:last-of-type .historical-dates__date').textContent;

        angle = i * angleStep - 1.047;
        point = {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
            title: el.querySelector('.historical-dates__list-title').textContent,
            date_start: dateStart,
            date_end: dateEnd,
            dates: el.querySelectorAll('.historical-dates__date'),
            desc: el.querySelectorAll('.historical-dates__desc'),
        };
        basePoints[key].push(point);
    });
});


let countPoints: any = 0;
let span: any = '';
let arrHistoricalDates: any = [];

// Цикл по всем узлам
basePoints.forEach((content: any, key: any) => {
    countPoints = 0;

    // Добавляем всю информацию углов в массив
    arrHistoricalDates[key] = [];
    content.forEach(function (el: any) {
        span = document.createElement("span");
        countPoints++;
        span.classList.add('historical-dates__period');
        span.style.left = el.x - 3 + 'px';
        span.style.top = el.y - 3 + 'px';
        if (countPoints == 1) {
            span.classList.add('active')
        }

        span.innerHTML = "<span class='historical-dates__circle-num'>" + countPoints + "</span>" +
            "<span class='historical-dates__circle-title'>" + el.title + "</span>" + "</span>" +
            "<span class='historical-dates__circle-dates'>" +
            "<span class='historical-dates__circle-date-start'>" + el.date_start + "</span>" +
            "<span class='historical-dates__circle-date-end'>" + el.date_end + "</span>" +
            "</span>";

        arrHistoricalDates[key].push(span);

    });
});


// Создаём узлы на диаграмме
document.querySelectorAll('.historical-dates__circle-wrap').forEach(function (el, key) {
    arrHistoricalDates[key].forEach(function (el2: any) {
        el.append(el2);
    });
});


let tl: any;
let tl1: any;
let rotate: any;
let ease: any = 'Linear.easeNone';

// Функция построения диаграммы
function diagramInit($parentCircleWrap: any, $rotationContain: any, $rotationPoints: any) {
    tl = new TimelineMax({});

    tl.to($parentCircleWrap, 1, {rotation: $rotationContain, ease: ease})
        .to($parentCircleWrap.querySelectorAll('.historical-dates__period'), 1, {rotation: $rotationPoints, ease: ease}, 0);

    return tl;
}


let btnFlag = 0;
let btnFlag2 = 0;
let parentBtn: any;
let parentCircleWrap;
let curActive;
let firstElement;
let nextSibling;
let curNumber;
let lastElement;
let prevSibling;
let interval;
let curClickNumber;
let activePoint = '';

// Кнопка Вперед
document.querySelectorAll('.historical-dates__next').forEach(function (el) {
    el.addEventListener('click', function () {

        parentBtn = this.closest('.historical-dates');

        numPoints = parentBtn.querySelectorAll('.historical-dates__list-item').length;

        if (btnFlag == 0 && btnFlag2 == 0) {
            btnFlag = 1;

            parentCircleWrap = parentBtn.querySelector('.historical-dates__circle-wrap');
            curActive = parentBtn.querySelector(".historical-dates__period.active");
            firstElement = parentBtn.querySelector(".historical-dates__period:nth-of-type(1)");
            nextSibling = parentBtn.querySelector(".historical-dates__period.active").nextElementSibling;
            curNumber = curActive.querySelector(".historical-dates__circle-num").textContent;


            if (curNumber != numPoints) {
                curActive.classList.remove('active');
                nextSibling.classList.add('active');
            } else {
                curActive.classList.remove('active');
                firstElement.classList.add('active');
            }

            rotate = (360 / numPoints);
            tl1 = diagramInit(parentCircleWrap, '-=' + rotate, '+=' + rotate);

            animationNumbers();

            activePoint = parentBtn.querySelector(".historical-dates__period.active").querySelector(".historical-dates__circle-num").textContent;
            activeSlider(parentBtn, activePoint);

            setTimeout(function () {
                btnFlag = 0;
            }, 700)
        }
    }, false);
});


// Кнопка Назад
document.querySelectorAll('.historical-dates__back').forEach(function (el) {
    el.addEventListener('click', function () {

        parentBtn = this.closest('.historical-dates');

        numPoints = parentBtn.querySelectorAll('.historical-dates__list-item').length;

        if (btnFlag == 0 && btnFlag2 == 0) {
            btnFlag2 = 1;

            parentCircleWrap = parentBtn.querySelector('.historical-dates__circle-wrap');
            curActive = parentBtn.querySelector(".historical-dates__period.active");
            lastElement = parentBtn.querySelector(".historical-dates__period:nth-of-type(" + numPoints + ")");
            prevSibling = parentBtn.querySelector(".historical-dates__period.active").previousElementSibling;
            curNumber = curActive.querySelector(".historical-dates__circle-num").textContent;

            if (curNumber > 1) {
                curActive.classList.remove('active');
                prevSibling.classList.add('active');
            } else {
                curActive.classList.remove('active');
                lastElement.classList.add('active');
            }
            rotate = (360 / numPoints);
            tl1 = diagramInit(parentCircleWrap, '+=' + rotate, '-=' + rotate);
            animationNumbers();

            activePoint = parentBtn.querySelector(".historical-dates__period.active").querySelector(".historical-dates__circle-num").textContent;
            activeSlider(parentBtn, activePoint);

            setTimeout(function () {
                btnFlag2 = 0;
            }, 700)
        }

    }, false);
});


// Клик на узел в диаграмме
document.querySelectorAll('.historical-dates__period').forEach(function (el) {
    el.addEventListener('click', function () {

        parentBtn = this.closest('.historical-dates');

        numPoints = parentBtn.querySelectorAll('.historical-dates__list-item').length;
        parentCircleWrap = parentBtn.querySelector('.historical-dates__circle-wrap');
        curActive = parentBtn.querySelector(".historical-dates__period.active");
        curNumber = Number(curActive.querySelector(".historical-dates__circle-num").textContent);
        curClickNumber = Number(this.querySelector(".historical-dates__circle-num").textContent);
        interval = Number(curClickNumber - curNumber);

        if (curClickNumber < curNumber) {
            interval = numPoints + interval;
        }

        curActive.classList.remove('active');
        this.classList.add('active');

        if (numPoints / 2 > interval) {
            rotate = (360 / numPoints) * interval;
            tl1 = diagramInit(parentCircleWrap, '-=' + rotate, '+=' + rotate);
        } else {
            interval = numPoints - interval;
            rotate = (360 / numPoints) * interval;
            tl1 = diagramInit(parentCircleWrap, '+=' + rotate, '-=' + rotate);
        }

        activeSlider(parentBtn, curClickNumber);

        animationNumbers();

    }, false);
});


// Анимация дат
function animationNumbers() {
    let dateStart;
    let dateEnd;
    let parentDates: any;

    document.querySelectorAll('.historical-dates__period.active').forEach(function (el: any) {
        dateStart = el.querySelector('.historical-dates__circle-date-start').textContent;
        dateEnd = el.querySelector('.historical-dates__circle-date-end').textContent;

        parentDates = el.closest('.historical-dates');

        let tl3 = new TimelineMax();
        tl3.to(parentDates.querySelector('.historical-dates__big-date-start'), {
            innerText: dateStart, duration: 1,
            snap: {
                innerText: 1
            }
        });

        let tl4 = new TimelineMax();
        tl4.to(parentDates.querySelector('.historical-dates__big-date-end'), {
            innerText: dateEnd, duration: 1,
            snap: {
                innerText: 1
            }
        });
    });
}

let arraySlider: any = [];
let div: any = '';
let t4;
let timeout = 0;
let currentNum: any = 0;
let countNum: any = 0;
let slider: any;
let sliderPagination: any;
let buttonNext: any;
let buttonPrev: any;

new Swiper('.swiper', {
    spaceBetween: 80,
    slidesPerView: 'auto',
    speed: 600,
});


// Анимация слайдера
function activeSlider($activeSlider?: any, $activePointNum: any = 1) {
    if ($activeSlider) {
        t4 = new TimelineMax({});
        timeout = 0.5;
        t4.to($activeSlider.querySelector('.historical-dates__slider-wrap'), timeout, {y: 10, alpha: 0, ease: ease})
            .to($activeSlider.querySelector('.historical-dates__slider-wrap'), timeout, {y: 0, alpha: 1, ease: ease})
        ;
    }
    document.querySelectorAll('.historical-dates').forEach(function (el, key) {

        setTimeout(function () {
            if (!$activeSlider || el == $activeSlider) {

                slider = el.querySelector('.swiper');

                slider.swiper.destroy();
                el.querySelectorAll('.swiper-wrapper div').forEach(function (el) {
                    el.remove();
                });
                el.querySelector('.swiper-wrapper').removeAttribute('style');

                arraySlider[key] = [];

                basePoints[key].forEach(function (el: any, $key2: any) {
                    if ($key2 + 1 == $activePointNum) {
                        el.dates.forEach(function (date: any, $key3: any) {
                            div = document.createElement("div");
                            div.classList.add('swiper-slide');
                            div.innerHTML = "<div class='historical-dates__slider-title'>" + date.textContent + "</div>" + "<div class='historical-dates__slider-desc'>" + el.desc[$key3].textContent + "</div>";
                            arraySlider[key].push(div);
                        });
                    }
                });

                arraySlider[key].forEach(function (el2: any) {
                    el.querySelector('.swiper-wrapper').append(el2);
                });

                sliderPagination = el.querySelector('.swiper-pagination');
                buttonNext = el.querySelector('.swiper-button-next');
                buttonPrev = el.querySelector('.swiper-button-prev');

                new Swiper(slider, {
                    spaceBetween: 25,
                    slidesPerView: 'auto',
                    speed: 600,
                    pagination: {
                        el: sliderPagination,
                        type: 'bullets',
                        clickable: true
                    },
                    navigation: {
                        nextEl: buttonNext,
                        prevEl: buttonPrev
                    },
                    breakpoints: {
                        1249: {spaceBetween: 80, slidesPerView: 3},
                        989: {spaceBetween: 25, slidesPerView: 3},
                        767: {spaceBetween: 50, slidesPerView: 2},
                        575: {spaceBetween: 25, slidesPerView: 'auto'},
                    },
                });


            }
        }, (timeout * 1000));


        //Выводим текущий узел/общее количество узлов
        currentNum = el.querySelector(".historical-dates__period.active .historical-dates__circle-num").textContent;
        countNum = el.querySelectorAll('.historical-dates__list-item').length;

        el.querySelector('.historical-dates__fraction-current').textContent = currentNum.toString().padStart(2, 0);
        el.querySelector('.historical-dates__fraction-total').textContent = countNum.toString().padStart(2, 0);

    });
}

activeSlider();


// Стартовые даты
document.querySelectorAll('.historical-dates').forEach(function (el) {
    let initDateStart = el.querySelector('.historical-dates__period.active .historical-dates__circle-date-start').textContent;
    let initDateEnd = el.querySelector('.historical-dates__period.active .historical-dates__circle-date-end').textContent;

    el.querySelector('.historical-dates__big-date-start').textContent = initDateStart;
    el.querySelector('.historical-dates__big-date-end').textContent = initDateEnd;
});


// Плавное появление всего блока "Исторических дат"
gsap.from(".historical-dates", {
    duration: .5,
    alpha: 0,
    ease: "Power1.easeIn",
});
