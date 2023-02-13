const popup = document.getElementById('popup');

function openPopup() {
    popup.classList.remove('hidden');
  }

function closePopup() {
    popup.classList.add('hidden');
}

if (popup.children[0].classList.contains('main-popup')) 
    openPopup();