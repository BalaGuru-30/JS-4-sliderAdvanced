'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navBtn = document.querySelectorAll('.nav__link');
const navLinkBtn = document.querySelector('.nav__links');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = document.querySelector('.nav').getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const lazyImgs = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const [btnSlideLeft, btnSlideRight] = document.querySelectorAll('.slider__btn');
const dots = document.querySelector('.dots');


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

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Page Navigation

//Usual method
// navBtn.forEach
// (function(el) {
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior : 'smooth'});
//   })
// })

//Delegation

navLinkBtn.addEventListener('click', function(e){
  e.preventDefault();
  const id = e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({behavior : 'smooth'});
});

//Smooth Scrolling


learnMoreBtn.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(window.pageXOffset,window.pageYOffset);

  window.scrollTo({left : window.pageYOffset + s1coords.left,
    top : window.pageYOffset + s1coords.top,
    behavior : 'smooth'
  });

  //Modern way of doing it
  // section1.scrollIntoView({behavior : 'smooth'});
});

//Tabbed Content

tabContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab');

  //To remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabContent.forEach(tc => tc.classList.remove('operations__content--active'));

  //To add active tabs and contents
  clicked.classList.add('operations__tab--active');
  const currContent = document.querySelector(`.operations__content--${clicked.dataset.tab}`);
  currContent.classList.add('operations__content--active');

})

//Nav Links (Passing arguments to event handlers)

const handleHover = function(e){
  if (e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(sib => {
      if (sib != link) sib.style.opacity = this;
    });
      logo.style.opacity = this;
   }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Adding sticky scroll

// window.addEventListener('scroll', function(e){  

//   const initialCoord = section1.getBoundingClientRect();
//   console.log(window.scrollY,initialCoord.top);

//   if(window.scrollY > initialCoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');

// })

//Better way

const obsOption = {
  root : null,
  threshold : 0,
  rootMargin : `-${navHeight}px`,
};

const obsCallBack = function(entries, observer){
  // nav.classList.add('sticky');
if (!entries[0].isIntersecting) nav.classList.add('sticky');
else nav.classList.remove('sticky');
}

const observer = new IntersectionObserver(obsCallBack, obsOption);
observer.observe(header);

//Revealing elements on scroll

const objElements = {
  root : null,
  threshold : 0.25,
};

const funElements = function (entries,als){
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // als.classList.remove('section--hidden');
  const section = entry.target;
  section.classList.remove('section--hidden');
  obsElements.unobserve(entry.target);
};

const obsElements = new IntersectionObserver(funElements, objElements);

allSections.forEach(als => {
  obsElements.observe(als);
  als.classList.add('section--hidden');
});

//Lazy loading of images

const objLazyImg = {
  root : null,
  threshold : 0,
  rootMargin : '200px',
};

const funLazyImg = function(entries){
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  })

  lazyImgObserver.unobserve(entry.target);
};

const lazyImgObserver = new IntersectionObserver(funLazyImg,objLazyImg);

lazyImgs.forEach(lazyImg => lazyImgObserver.observe(lazyImg));

//Slider component

let curSlide = 0;
let totalSlides = slides.length;
console.log(document.querySelectorAll('.dots__dot'));

const funDispDots = function(){
  slides.forEach((_,index) => {
    dots.insertAdjacentHTML('beforeend', 
    `<button class="dots__dot" data-slide="${index}"></button>`)
  })
}

funDispDots();

const funActiveDots = function(i){
  document.querySelectorAll('.dots__dot').forEach((dot,index) => {
    dot.classList.remove('dots__dot--active');
    if (Number(i) === index)
    dot.classList.add('dots__dot--active');
  })
}

const funSlider = function(current){
  slides.forEach((slide,index) => slide.style.transform = `translateX(${100 * (index - current)}%)`);
  funActiveDots(current);
}

funSlider(0);

const nextSlide = function(){
  if (curSlide >= totalSlides - 1) curSlide = 0;

  else curSlide += 1;

  funSlider(curSlide);

};

const prevSlide = function(){
  if (curSlide <= 0) curSlide = totalSlides - 1;

  else curSlide -= 1;

  funSlider(curSlide);

};

btnSlideRight.addEventListener('click', nextSlide);

btnSlideLeft.addEventListener('click', prevSlide);


dots.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
  const slide = e.target.dataset.slide;
  funSlider(slide);
  funActiveDots(slide);
  }
})

//<button class="dots__dot" data-slide="1"></button>






