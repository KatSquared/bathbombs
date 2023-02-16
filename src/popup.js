const popup = document.getElementById('popup');

function openPopup() {
  popup.classList.remove('hidden');
  if (currentImg) {
    let enlargedImg = document.getElementById('enlarged-image');
    enlargedImg.src = currentImg.src;
  } else return
}

function closePopup() {
    popup.classList.add('hidden');
}

if (popup.children[0].classList.contains('main-popup')) 
    openPopup();

