//
// SECTIONS COMPONENT GENERATION
//

let sectionsNavbar = document.getElementById('sections-navbar');

let makeNavbarComponent = () => {
  return sectionsNavbar.innerHTML = `
    <div class="sections-links hidden flex">
      <div class="section">
        <a href="special-offer.html">SPECIAL OFFER</a>
      </div>
      <div class="section">
        <a href="bathbombs.html">BATHBOMBS</a>
      </div>
      <div class="section">
        <a href="soaps.html">SOAPS & ACCESORIES</a>
      </div>
    </div>
  `
}

makeNavbarComponent();

//
// SHORTHAND COMPONENT GENERATION
//

let shorthandNavbar = document.getElementById('shorthand-navbar');

let makeShorthandComponent = () => {
  return shorthandNavbar.innerHTML = `
    <div class="logo">
      <a href="index.html"><p class="logo-letters">:BB:</p></a>
      <a href="index.html"><p class="logo-desc">BOOMBASTIC<br>BATHBOMBS</p></a>
      
    </div>

    <div class="shorthand-offer">
        <a href="tel:+48504412332">OUR SPECIAL LIMITED OFFER STARTS NOW.<br>FREE SHIPPING, 
            FREE WRAPPING, ALL 50% OFF.
        </a>
    </div>
    <div class="shorthand-menu">
        <div class="shorthand-menu__label">
            <i class="fa-solid fa-magnifying-glass"></i>
            <i class="fa-solid fa-user"></i>
            <a href=basket.html class="cart-icon-and-amount">
              <i class="fa-solid fa-basket-shopping"></i>
              <p id="cartAmount">0</p>
            </a>
            <i class="fa-solid fa-bars" onclick="showMenu()"></i>
        </div>
        
        <div class="menu-links" id="menuLinks"> 
            <i class="fa-solid fa-xmark" onclick="hideMenu()"></i>
            <ul>
              <div class="sections-links hidden menu-links-sections">
                <div class="section">
                  <a href="special-offer.html">SPECIAL OFFER</a>
                </div>
                <div class="section">
                  <a href="bathbombs.html">BATHBOMBS</a>
                </div>
                <div class="section">
                  <a href="soaps.html">SOAPS & ACCESORIES</a>
                </div>
              </div>
              <li onclick="scrollToCompany()"><a href="#company">COMPANY</a></li>
              <li onclick="scrollToMission()"><a href="#mission">OUR MISSION</a></li>
              <li onclick="scrollToProducts()"><a href="#products">PRODUCTS</a></li>
              <li onclick="scrollToTestimonials()"><a href="#testimonials">TESTIMONIALS</a></li>
              <li onclick="scrollToContact()"><a href="#footer">CONTACT</a></li>
            </ul>
            <h1 class="menu-logo">:BB:</h1>
        </div>
    </div>
  `
}

makeShorthandComponent();

//
// FOOTER COMPONENT GENERATION
//

let footer = document.getElementById('footer');

let makeFooterComponent = () => {
  return footer.innerHTML = `
    <div class="contact-container">
      <div class="wave">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
        </svg>
      </div>
      <div class="contact-footer-col contact-menu">
          <h5>MENU</h5>
          <ul class="contact-menu">
              <li><a href="#company">Company</a></li>
              <li><a href="#mission">Our Mission</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
          </ul>
      </div>

      <div class="contact-footer-col contact-address">
          <h5>VISIT US AT</h5>
          <ul>
              <li>Bubble Road 22<br>BA1 1QU, Bath<br>England</li>
              <li><span>When to reach us:</span>
                  <br>MON-FRI: 8AM - 6PM</li>
          </ul>
      </div>

      <div class="contact-footer-col navigation">
          <h5>NAVIGATION</h5>
          <a href="https://goo.gl/maps/rrpUsVMW7rFqGvtt8" target="_blank">
              <i class="fa-solid fa-location-dot"></i>
          </a> 
      </div>

      <div class="contact-footer-col">
          <h5>CONTACT INFORMATION</h5>
          <ul>
              <li><a href="tel:+34648769696"> 
                <i class="fa-solid fa-phone-volume"></i>+46 433 324 22
              </li></a>
              <li><a href="mailto:contact@boombasticbathbombs.com">
                <i class="fa-solid fa-dove"></i>contact@boombath.com
              </a></li>
              <li><a href="index.html">
                <i class="fa-solid fa-star"></i>FAQ
              </a></li>
              <li><a href="index.html">
                <i class="fa-solid fa-hand-holding-heart"></i>Returns & Services
              </a></li>
          </ul>
      </div>
    </div>
      
    <div class="footer-credit">
      <p>Design & implementation: <span style="text-decoration: underline;">Katarzyna Kmita</span></p>
    </div>
  `
}

makeFooterComponent();

//
// SMOOTH SCROLL TO PAGE SECTION
//
let scrollToCompany = () => {
  document.getElementById('company').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

let scrollToMission = () => {
  document.getElementById('mission').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

let scrollToProducts = () => {
  document.getElementById('products').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

let scrollToTestimonials = () => {
  document.getElementById('testimonials').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

let scrollToContact = () => {
  document.getElementById('footer').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}