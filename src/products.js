//
// FILTERS COMPONENT GENERATION
//

let filtersComponent = document.getElementById('filters');

let makeFiltersComponent = () => {
    return filtersComponent.innerHTML = `
        <div class="filters-container">
            <div class="category-filters-container">
            <div class="category-dropdown" id="dropdown">
                <div class="flex dropdown-btn" id="dropdown-btn">
                <p>Shape</p>
                <i class="fa-solid fa-angle-down" id="caret"></i>
                </div>
                <div class="dropdown-content" id="dropdown-content">
                <div class="flex">
                    <i class="fa-regular fa-square category-filter" id="sphere" data-category="shape"></i>
                    <p class="category-filter" id="sphere">Sphere</p>
                </div>
                <div class="flex">
                    <i class="fa-regular fa-square category-filter" id="star-n-heart" data-category="shape"></i>
                    <p class="category-filter" id="star">Star&Heart</p>
                </div>
                <div class="flex">
                    <i class="fa-regular fa-square category-filter" id="other" data-category="shape"></i>
                    <p class="category-filter" id="heart">Other</p>
                </div>
                <div class="flex">
                    <i class="fa-regular fa-square category-filter" id="dessert" data-category="shape"></i>
                    <p class="category-filter" id="cupcake">Dessert</p>
                </div>
                </div>
            </div>

            <div class="category-dropdown" id="dropdown">
                <div class="flex dropdown-btn" id="dropdown-btn">
                <p>Smell</p>
                <i class="fa-solid fa-angle-down" id="caret"></i>
                </div>
                <div class="dropdown-content" id="dropdown-content">
                <div class="flex">
                    <i class="fa-regular fa-square category-filter" id="fruity" data-category="smell"></i>
                    <p class="category-filter" id="fruity">Fruity</p>
                </div>
                <div class="flex" id="floral">
                    <i class="fa-regular fa-square category-filter" id="floral" data-category="smell"></i>
                    <p class="category-filter" id="floral">Floral</p>
                </div>
                <div class="flex"  id="warm">
                    <i class="fa-regular fa-square category-filter" id="warm" data-category="smell"></i>
                    <p class="category-filter" id="warm">Warm</p>
                </div>
                <div class="flex" id="fresh">
                    <i class="fa-regular fa-square category-filter" id="refreshing" data-category="smell"></i>
                    <p class="category-filter" id="fresh">Refreshing</p>
                </div>
                </div>
            </div>
            </div>
            
            <div class="sort-by-filter" id="dropdown">
            <div class="flex dropdown-btn" id="dropdown-btn">
                <p>Sort by</p>
                <i class="fa-solid fa-angle-down"></i>
            </div>
            <div class="dropdown-content" id="dropdown-content">
                <div class="flex selected-option">
                <i class="fa-solid fa-wand-magic-sparkles sorting-options" id="relevancy"></i>
                <p class="sorting-options" id="relevancy">Relevancy</p>
                </div>
                <div class="flex">
                <i class="fa-regular fa-face-grin-stars sorting-options" id="popularity"></i>
                <p class="sorting-options" id="popularity">Popularity</p>
                </div>
                <div class="flex">
                <i class="fa-solid fa-arrow-up sorting-options" id="price-up"></i>
                <p class="sorting-options" id="price-up">Price Up</p>
                </div>
                <div class="flex">
                <i class="fa-solid fa-arrow-down sorting-options" id="price-down"></i>
                <p class="sorting-options" id="price-down">Price Down</p>
                </div>
            </div>
            </div>
        </div>
    `
}

makeFiltersComponent();


//
// SPECIAL OFFER COMPONENT GENERATION
//

let specialOfferComponent = document.getElementById('special-offer');

let makeSpecialOfferComponent = () => {
    return specialOfferComponent.innerHTML = `
        <h2>SPECIAL OFFER</h2>
            <div class="special-offer-container">
            <button class="carousel-button button-left">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="special-offer-carousel carousel">
                <div class="special-offer-carousel-track carousel-track">

                <!--COPY OF LAST SLIDE-->
                <div class="special-item">
                    <div class="discount-label">
                    <p>-50%</p>
                    </div>
                    <img src="/src/img/bathbomb16.png" alt="bathbombs sidebar image">    
                </div>

                <!--normal slides-->
                <div class="special-item">
                    <div class="discount-label">
                    <p>-40%</p>
                    </div>
                    <img src="/src/img/bathbomb9.png" alt="bathbombs sidebar image">        
                </div>
            
                <div class="special-item">
                    <div class="discount-label">
                    <p>-30%</p>
                    </div>
                    <img src="/src/img/bathbomb6.png" alt="bathbombs sidebar image">         
                </div>
            
                <div class="special-item">
                    <div class="discount-label">
                    <p>-50%</p>
                    </div>
                    <img src="/src/img/bathbomb16.png" alt="bathbombs sidebar image">        
                </div>

                <!--COPY OF FIRST SLIDE-->
                <div class="special-item">
                    <div class="discount-label">
                    <p>-40%</p>
                    </div>
                    <img src="/src/img/bathbomb9.png" alt="bathbombs sidebar image">        
                </div>
                </div>
            </div>

            <button class="carousel-button button-right">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    `
}

if (specialOfferComponent) makeSpecialOfferComponent();


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

document.addEventListener('click', (e) => {
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
document.addEventListener('click', (e) => {
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
  filtered = products
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
        return filtered.sort((a, b) => 
          (a.price - (a.price * a.discount/100)) - (b.price - (b.price * b.discount/100)));
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
let products = shopItemsData;
let selection = [];
let basket = JSON.parse(localStorage.getItem("basket")) || [];

let productTypeFilter = () => {
  switch(shop.className){
    case 'products-grid bathbombs':
      return products = shopItemsData.filter(item => item.category == 'BATHBOMB');
    case 'products-grid soaps':
      return products = shopItemsData.filter(item => item.category == 'SOAP');
    case 'products-grid special-offer':
      return products = shopItemsData.filter(item => item.discount != 0);
    default:
      return products;
  }
}

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
    productTypeFilter();
    filterItems();
    sortItems(sortBy);
    return (shop.innerHTML = filtered
      .map((x) => {
        let {id, img, name, weight, price, discount, stock} = x;
        let search = selection.find((x) => x.id === id) || [];
        return `
          <div class="products-grid-item" id="product-id-${id}">
            <a href="blueberry-dream.html">
              <div class="item-image">
                <img src="${img}" alt="${name} photo">
                ${discount == 0 ? '' : `
                  <div class="discount-label">
                    <p>-${discount}%</p>
                  </div>
                `}
              </div>
              <h2 class="item-name">${name}</h2>
            </a>
            <div class="flex">
              <div class="item-properties">
                  <p class="item-weight">${weight}g</p>
                  <p class="item-price">${discount != 0 ? `
                    <span style="text-decoration: line-through">${price} USD</span>
                    <span style="font-weight: 600"> ${Math.round(price - (discount/100 * price))} USD</span>
                  ` : `${price} USD`}</p>
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
                <button onclick="addToBasket(${id})" class="add-to-basket ${buttonDisable(stock)}">
                  <i class="fa-solid fa-basket-shopping"></i>
                </button>
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