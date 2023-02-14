//
// SCROLL-INTO-VIEW ANIMATIONS FOR MOBILE
//
const viewportWidth = window.innerWidth
console.log(viewportWidth)

if (viewportWidth < 900) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            } else {
                entry.target.classList.remove('animate');
            }
        });
    });
    
    const elementsToAnimate = document.querySelectorAll('.main-col');
    elementsToAnimate.forEach((el) => observer.observe(el));
}
