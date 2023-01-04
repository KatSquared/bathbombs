//
// FILTER DROPDOWNS //
//

const dropdowns = document.querySelectorAll('#dropdown');

dropdowns.forEach(dropdown => {
  const dropdownBtn = dropdown.querySelector('#dropdown-btn');
  const content = dropdown.querySelector('#dropdown-content');

  dropdownBtn.addEventListener('click', () => {
      dropdownBtn.classList.toggle('unrolled');
      content.classList.toggle('visible');
  })
})

document.addEventListener('click', function(e) {
  if (e.target.closest('#dropdown-content')) return;

  dropdowns.forEach(dropdown => {
    const content = dropdown.querySelector('#dropdown-content');
    const dropdownBtn = content.previousElementSibling;

    if (e.target.closest('#dropdown-btn')) {
      if (dropdownBtn != e.target.closest('#dropdown-btn')) {
        content.classList.remove('visible');
        dropdownBtn.classList.remove('unrolled');
      }
      return;
    }
    
    if (content.classList.contains('visible')) {
      content.classList.remove('visible');
      dropdownBtn.classList.remove('unrolled');
    }
  })
})


// 
// FILTERING ITEMS //
//

const categoryFilters = Array.from(document.getElementsByClassName('category-filter'));
let shapeFilters = [];
let smellFilters = [];

const sortByOptions = Array.from(document.getElementsByClassName('sorting-options'));
let sortBy;

let filtered = shopItemsData;


// Processing value of filters input by users
document.addEventListener('click', function(e) {
  // checks if element clicked is a category filter
  if (!categoryFilters.includes(e.target)) {
    // returns if element clicked isn't a category filter or sorting option
    if (!sortByOptions.includes(e.target)) return;

    // THE CASE WHEN ELEMENT CLICKED IS A SORTING OPTION
    let option = e.target.closest('.flex');
    // removes selection from whatever was selected previously
    document.getElementsByClassName('selected-option')[0].classList.remove('selected-option');
    // adds selection to clicked option
    option.classList.add('selected-option');

    // sorts items according to the selected option
    sortBy = e.target.closest('.sorting-options').id;
    sortItems(sortBy);
    generateShop();
    return;
  } 

  // THE CASE WHEN ELEMENT CLICKED IS A CATEGORY FILTER:
  let checkBox = e.target.closest('.fa-regular');

  // checking and checking off boxes when clicked on
  if (checkBox == null) 
    checkBox = e.target.closest('.category-filter').previousElementSibling;

  checkBox.classList.toggle('fa-square-check');
  checkBox.classList.toggle('fa-square');
  
  // adding and removing filters
  let category = checkBox.dataset.category;

  if (checkBox.classList.contains('fa-square-check')) {
    if (category == 'shape') {
      shapeFilters.push(checkBox.id);
      generateShop();
    }
    else if (category == 'smell') {
      smellFilters.push(checkBox.id);
      generateShop();
      }
    return;
  }
  if (category == 'shape') {
    shapeFilters = shapeFilters.filter((x) => x != checkBox.id);
    generateShop();
  }
  else if (category == 'smell') {
    smellFilters = smellFilters.filter((x) => x != checkBox.id);
    generateShop();
  }
});


// Filtering items by tags
let filterItems = () => {
  filtered = shopItemsData
  .filter(item => {
    if (shapeFilters.length === 0) return true;

    for (let shapeFilter of shapeFilters)
      if (shapeFilter == item.tags.shape)
        return true;
      return false;
  })
  .filter(item => {
    if (smellFilters.length === 0) return true;

    for (let smellFilter of smellFilters)
      if (smellFilter == item.tags.smell)
        return true;
      return false;
  })

  return filtered;
}


// Sorting items by price up, down, relevancy(default) and popularity
let sortItems = (sortBy) => {
  let presorted = filtered;

  switch (sortBy) {
    case 'popularity':
        return filtered.sort((a, b) => b.popularity - a.popularity);
    case 'price-up':
        return filtered.sort((a, b) => a.price - b.price);
    case 'price-down':
        return filtered.sort((a, b) => b.price - a.price);
    default:
        return filtered = presorted;
  }
}


// 
// GENERATING SHOP ITEMS //
//

let shop = document.getElementById('shop');
let selection = [];
let basket = JSON.parse(localStorage.getItem("basket")) || [];

let stockLabel = (stock) => {
    if (stock >= 15)
      return `<p class="stock">${stock} IN STOCK`;     
    if (stock < 15 && stock > 0)
      return `<p class="stock low-stock">${stock} IN STOCK`;
    return `<p class="stock out-of-stock">OUT OF STOCK`;
}

let buttonDisable = (stock) => {
  if (stock > 0) return;     
  return `disabled-btn`;
}

let generateShop = () => {
    filterItems();
    sortItems(sortBy);
    return (shop.innerHTML = filtered
      .map((x) => {
        let {id, img, name, weight, price, stock} = x;
        let search = selection.find((x) => x.id === id) || [];
        return `
          <div class="products-grid-item" id="product-id-${id}">
            <a href="blueberry-dream-jsnfnjdngjts.html">
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
            </div>
            <div class="cart-and-quantity">
              <div class="quantity-adjustment-container ${buttonDisable(stock)}">
                <i onclick="decrement(${id})" class="fa-solid fa-minus"></i>
                <p class="quantity" id="${id}">
                  ${search.item === undefined ? 1 : search.item}
                </p>
                <i onclick="increment(${id})" class="fa-solid fa-plus"></i>
              </div>
                <div onclick="addToBasket(${id})" class="add-to-basket ${buttonDisable(stock)}">
                  <i class="fa-solid fa-basket-shopping"></i>
                </div>
            </div> 
            ${stockLabel(stock)}
          </div>
        `;
      }).join(''));
};

generateShop();


//
// ADDING TO BASKET //
//

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