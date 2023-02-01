const container = document.querySelector('.slider');
const track = document.querySelector('.slider-track');
const slides = Array.from(track.children);
const item = document.querySelector('.products-grid-item');
const nextButton = document.querySelector('.button-right i');
const prevButton = document.querySelector('.button-left i');

let margin = '';
if (window.innerWidth < 900) margin = 60;
else margin = 120;

const containerWidth = container.getBoundingClientRect().width;
const slideWidth = slides[0].getBoundingClientRect().width + margin;
const trackWidth = slides.length * slideWidth;

let index = 0;

console.log();

// shifting the whole track by a slide's length
const moveToSlide = (track) => {
    let amountToMove = index * slideWidth;

    // doesn't scroll if slider is at its starting position
    if (amountToMove < -slideWidth/2) return;
    
    // slides only the remaining amount to the border of container and hides nextButton
    if (amountToMove >= trackWidth - containerWidth ) {
        nextButton.classList.add('inactive');
        amountToMove = (index-1) * slideWidth + containerWidth % slideWidth + margin;
        track.style.transform = 'translateX(' + -amountToMove + 'px)';
        return;
    }
    prevButton.classList.remove('inactive');
    nextButton.classList.remove('inactive');
    
    track.style.transform = 'translateX(' + -amountToMove + 'px)';

    // prevButton disappears when slider arrives at starting position
    if (index <= 0) 
        prevButton.classList.add('inactive');
};

// slides move to the left after clicking left
prevButton.addEventListener('click', e => {
    index--;
    moveToSlide(track);
});

// slides move to the right after clicking right
nextButton.addEventListener('click', e => {
    index++;
    moveToSlide(track);
});

