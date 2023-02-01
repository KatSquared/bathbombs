const container = document.querySelector('.carousel');
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.button-right i');
const prevButton = document.querySelector('.button-left i');
const slideWidth = slides[0].getBoundingClientRect().width;

let index = 1;

track.style.transform = 'translateX(' + (-550/slides.length) + '%)';

// shifting the whole track by a slide's length and changing 
// the current slide class to the next/prev slide that gets there
const moveToSlide = (track) => {
    track.style.transform = 'translateX(' + (index*-550/slides.length) + '%)';
};

// slides move to the left after clicking left
prevButton.addEventListener('click', e => {
    // prevents a bug when user clicks too fast for a transition to finish
    if (index <= 0) return;

    // returns transition to normal after jumping from one edge to another
    track.style.transition = 'transform 500ms ease-in-out';
    // finds the elements with the current class, what we are on NOW
    const currentSlide = slides[index];
    // determines what the slide and dot to jump to as previous will be
    const prevSlide = currentSlide.previousElementSibling;

    index--;
    moveToSlide(track);
});

// slides move to the right after clicking right
let moveToNextSlide = () => {
    // prevents a bug when user clicks too fast for a transition to finish
    if (index >= slides.length-1) return;
        
    // returns transition to normal after jumping from one edge to another
    track.style.transition = 'transform 500ms ease-in-out';
    // finds the elements with the current class, what we are on NOW
    const currentSlide = slides[index];
    // determines what the slide and dot to jump to as next will be
    const nextSlide = currentSlide.nextElementSibling;

    index++;
    moveToSlide(track);
}
nextButton.addEventListener('click', e => moveToNextSlide());

// looping
track.addEventListener('transitionend', e => {
    if (index === slides.length-1) {
        // deleting transition so that we can jump seamlessly from 
        // copy of first slide at the end to first proper slide
        track.style.transition = 'none';
        track.style.transform = 'translateX(' + (-550/slides.length) + '%)';
        index = 1;
    } else if (index === 0) {
        // deleting transition so that we can jump seamlessly from 
        // copy of last slide at the beginning to last proper slide
        track.style.transition = 'none';
        track.style.transform = 'translateX(' + (-550*(slides.length-2)/slides.length) + '%)';
        index = slides.length-2;
    } else return;
}, false)

// automatic scroll
setInterval(moveToNextSlide, 10000);