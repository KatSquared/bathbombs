//
// GENERATING SUGGESTIONS LIST
//

let suggestions = document.getElementById('suggestions');
let suggestedItems = shopItemsData;

try {
    let currentProduct = document.querySelector('.quantity').id;
    suggestedItems = shopItemsData.filter((x) => x.id != currentProduct);
} catch (error) {}

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