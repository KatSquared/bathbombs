const popup = document.getElementById('popup');

function openPopup() {
  if (currentImg) {
    let enlargedImg = document.getElementById('enlarged-image');
    enlargedImg.src = currentImg.src;
  }
  popup.classList.remove('hidden');
}

function closePopup() {
    popup.classList.add('hidden');
}

if (popup.children[0].classList.contains('main-popup')) 
    openPopup();

