//
// ADDING TO BASKET 
//

let basket = JSON.parse(localStorage.getItem("basket")) || [];
let selection = []

let increment = (id) => {
  let selectedItem = id;
  let search = selection.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    selection.push({
      id: selectedItem.id,
      item: 2
    })
  } else {
    search.item += 1;
  }

  update(selectedItem.id);
};

let decrement = (id) => {
  let selectedItem = id;
  let search = selection.find((x) => x.id === selectedItem.id);

  if (search === undefined || search.item <= 1) return;
  else {
    search.item -= 1;
  }

  update(selectedItem.id);
};

let update = (id) => {
  let search = selection.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

let addToBasket = (id) => {
  let selectedItem = id;
  let searchInBasket = basket.find((x) => x.id === selectedItem.id);
  let searchInSelection = selection.find((x) => x.id === selectedItem.id);

  if (searchInBasket === undefined) {
    if (searchInSelection === undefined) {
      basket.push({
        id: selectedItem.id,
        item: 1
      });
    } 
    else {
      basket.push({
        id: selectedItem.id,
        item: searchInSelection.item
      })}
  } else {
      if (searchInSelection === undefined)
        searchInBasket.item++;
      else searchInBasket.item += searchInSelection.item;
  }
 
  localStorage.setItem("basket", JSON.stringify(basket));

  calculation();
};

//
// IMAGE GALLERY
//

let changeImage = (image) => {
  const currentImg = document.getElementById('currentImage');
  const prevSrc = currentImg.src;
  currentImg.src = image.src;
  image.src = prevSrc;
}

//
// SHOW ALL INGREDIENTS
//

const ingredientList = document.getElementById('ingredientList');

let showIngredients = (button) => {
  ingredientList.classList.toggle('hidden');
  button.classList.toggle('fa-minus');
  button.classList.toggle('fa-plus');
}