'use strict';

///////////////////////////////////////
// Modal window

const header = document.querySelector('.header');
const navigation = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');

const tabsContent = document.querySelectorAll('.operations__content');
const btnScrollto = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button scrolling

btnScrollto.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page navigation

// document.querySelectorAll('.nav__link').forEach(el =>
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     console.log(`LINK`);
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );
//1 Add event listener to common parent element

//2. What element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  //Matching targeting
  if (
    e.target.classList.contains('nav__link') &&
    e.target.getAttribute('href') !== '#'
  ) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document?.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }
});

//Working with Tabs
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // e.classList.remove('operations__tab--active');
  if (!clicked) return;
  //Active tab
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Active main window
  tabsContent.forEach(e => e.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade nimation

const handleOver = function (e) {
  // console.log(this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const logo = link.closest('.nav').querySelector('img');

    const opacity = this;

    siblings.forEach(function (e) {
      if (e !== link) {
        e.style.opacity = opacity;
      }
      logo.style.opacity = opacity;
    });
  }
};

//Passing "arguments" into handler
navigation.addEventListener('mouseover', handleOver.bind(0.5));

navigation.addEventListener('mouseout', handleOver.bind(1));

//Sticky navigation
// const cords = section1.getBoundingClientRect();
// console.log(cords);
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > cords.top) {
//     navigation.classList.add('sticky');
//   } else navigation.classList.remove('sticky');
// });

//Sticky navigation with : --> Intersection observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entries => console.log(entries));
// };

// const observerOptions = {
//   root: null,
//   threshold: [0, 1, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, observerOptions).observe(
//   section1
// );
const navHeight = navigation.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const entrie = entries[0];
  // console.log(entrie);
  if (!entrie.isIntersecting) navigation.classList.add('sticky');
  else navigation.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}).observe(header);

//Reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const entry = entries[0];
  if (entry.isIntersecting) entry.target.classList.remove('section--hidden');
  else return;
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImages = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry.target.src);
  if (!entry.isIntersecting) return;
  //Replace src with data src
  else {
    entry.target.src = entry.target.dataset.src;
    // console.log(entry.target.src);
    // entry.target.classList.remove('lazy-img');  Its fast and not effective

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
  }
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.5,
});

imgTargets.forEach(function (el) {
  imageObserver.observe(el);
});

//Slider
const sliderFunc = function () {
  const dotContainer = document.querySelector('.dots');
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let currentSlide = 0;
  const maxSlides = slides.length;

  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // 0% , 100%, 200%, 300%

  const goToSlide = function (slide) {
    slides.forEach(
      (el, i) => (el.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class= 'dots__dot' data-slide = '${i}'></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  init();

  const nextSlide = function () {
    if (currentSlide === maxSlides - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);

    // -100% , 0% , 100%, 200%,
  };

  const prevSlide = function () {
    if (currentSlide == 0) {
      currentSlide = maxSlides - 1;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  //Next slide
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });

  //Dots event listener

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log(`THIS`);
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

sliderFunc();
//////
/*

//Selecting elements
console.log(document.documentElement);
const allSections = document.querySelectorAll('.section');
const header = document.querySelector('.header');

console.log(allSections);

const section1 = document.getElementById('section--1');
console.log(section1);

const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

const btn = document.getElementsByClassName('btn');
console.log(btn);

//Creating and inserting elements
//.insertAdjecentHTML();
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'we use cookies to improve functionality an analytics';
message.innerHTML =
  'we use cookies to improve functionality an analytics.<button class = "btn btn--close-cookie">Got it!</button>';

// message.insertAdjacentHTML(
//   'afterbegin',
//   '<p> Inserted text </p>                                                                                  <p>inserted text 2</p>'
// );

// header.prepend(message); //Adds element as the first in HTML

header.append(message); //Adds elemens as the last element in HTML

// header.append(message.cloneNode(true)) // if we want to have multiple same elements at the bottom and at the begining

// header.before(message);
// header.after(message);

//Delete elements

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

message.style.backgroundColor = '#37383d';

message.style.width = '120%';
console.log(message.style.height);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

//Atributes

const logo = document.querySelector('.nav__logo');

console.log(logo.src);
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';
//Non standart
console.log(logo.designer);
console.log(logo.getAttribute('designer'));

logo.setAttribute('company', 'bankist');
console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.twitter-link');

console.log(link.href);
console.log(link.getAttribute('href'));

//Data atributes

console.log(logo.dataset.versionNumber);

//Classes

logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

//Donst use
logo.className = 'jonas';

*/

// const h1 = document.querySelector('h1');

// const alertH1 = function () {
//   alert('Great u hobered over the title :D');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 1000);

//rendom color
// rgb (255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function () {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav__links').addEventListener('click', function () {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function () {
//   this.style.backgroundColor = randomColor();
// });
/*

const h1 = document.querySelector('h1');

//Goind downwards: selecting child elements

console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);

console.log(h1.firstElementChild);
console.log(h1.lastElementChild);

//Going upwards in DOM tree

console.log(h1.parentNode);
console.log(h1.parentElement);

console.log(h1.closest('.header'));

h1.closest('.header').style.background = 'var(--gradient-primary)';

//Goins sideways ---Siblings xDDD---

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);

console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(el => (el.style.color = 'blue'));
*/
