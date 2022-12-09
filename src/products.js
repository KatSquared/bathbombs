let shop = document.getElementById('shop');

let selection = [];

let basket = JSON.parse(localStorage.getItem("basket")) || [];

let generateShop = () => {
    return (shop.innerHTML = shopItemsData
      .map((x) => {
        let {id, img, name, slug, weight, price, stock} = x;
        let search = selection.find((x) => x.id === id) || [];
        return `
        <div class="products-grid-item" id="product-id-${id}">
            <a href="${slug}-${id}.html">
              <div class="item-image">
                <img src="${img}" alt="">
              </div>
              <h2 class="item-name">${name}</h2>
            </a>
            <div class="flex">
              <div class="item-properties">
                  <p class="item-weight">${weight}g</p>
                  <p class="item-price">${price} USD</p>
              </div>
            </div>
            <div class="cart-and-quantity">
              <div class="quantity-adjustment-container">
                <i onclick="decrement(${id})" class="fa-solid fa-minus"></i>
                <p class="quantity" id="${id}">
                  ${search.item === undefined ? 1 : search.item}
                </p>
                <i onclick="increment(${id})" class="fa-solid fa-plus"></i>
              </div>
                <div onclick="addToBasket(${id})" class="add-to-basket">
                  <i class="fa-solid fa-basket-shopping"></i>
                </div>
            </div> 
            <p class="stock">${stock} IN STOCK</p>
          </div>
        `;
      }).join(''));
};

generateShop();


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

