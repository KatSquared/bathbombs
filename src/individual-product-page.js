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
// GENERATING SUGGESTIONS LIST
//

let suggestions = document.getElementById('suggestions');
let currentProduct = document.querySelector('.quantity').id
let suggestedItems = shopItemsData.filter((x) => x.id != currentProduct);

let stockLabel = (stock) => {
  if (stock >= 15)
    return `<p class="stock">${stock} IN STOCK`;     
  if (stock < 15 && stock > 0)
    return `<p class="stock low-stock">${stock} IN STOCK`;
  return `<p class="stock out-of-stock">OUT OF STOCK`;
}

let generateSuggestions = () => {
  return (suggestions.innerHTML = suggestedItems
    .map((x) => {
      let {id, img, name, weight, price, stock} = x;
      if (stock <= 0) return; 
      return `
        <div class="products-grid-item slider-item" id="product-id-${id}">
          <a href="blueberry-dream.html">
            <div class="item-image">
              <img src="${img}" alt="${name} photo">
            </div>
            <h2 class="item-name">${name}</h2>
          </a>
          <div class="flex">
            <div class="item-properties">
                <p class="item-weight">${weight}g</p>
                <p class="item-price">${price} USD</p> 
            </div>
            <button class="add-to-basket">
                <div id="${id}" onclick="addToBasket(${id})">
                  <i class="fa-solid fa-basket-shopping"></i>
                </div>
            </button>
          </div>
          ${stockLabel(stock)}
        </div>
      `;
    }).join(''));
};

generateSuggestions();


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