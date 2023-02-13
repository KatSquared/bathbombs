let orderSummary = document.getElementById('order-summary');
let shoppingCart = document.getElementById('shopping-cart');
let columnLabels = document.getElementById('column-labels');
let message = document.getElementById('message');
let basket = JSON.parse(localStorage.getItem("basket")) || [];
const removeAll = document.getElementById('removeAll');
const underline = document.getElementById('underline');

let discount = 15;


let calculation = () => {
    let cartIcons = document.querySelectorAll("#cartAmount");
    cartIcons.forEach(icon => {
        icon.innerHTML = basket
            .map((x) => x.item)
            .reduce((x, y) => x + y, 0);
    })
  };
  
calculation();

let generateCartItems = () => {
    if (basket.length !== 0) {
        return (shoppingCart.innerHTML = basket
            .map((x) => {
                let {id, item} = x;
                let search = shopItemsData.find((y) => y.id === id) || [];
                let {img, name, category, price} = search;
                message.innerHTML = ``;
                return `
                    <div class="cart-item basket-grid">
                        <img class="cart-img" width="100px" src="${img}"></img>

                        <div class="name-and-category">
                            <p class="product-category">${category}</p>   
                            <p class="product-name">${name}</p>
                        </div>
                        
                        <div class="cart-buttons">
                            <div class="quantity-adjustment-container">
                                <i onclick="decrement(${id})" class="fa-solid fa-minus"></i>
                                <p class="quantity" id="${id}">${item}</p>
                                <i onclick="increment(${id})" class="fa-solid fa-plus"></i>
                            </div>
                        </div>
                        
                        <p class="product-total">${item * price} USD</p>
                        <i onclick="removeItem(${id})" class="fa-sharp fa-solid fa-xmark"></i>
                    </div>

                    <div class="cart-item-underline"></div>
                `
            })
            .join(''));
    }
    else {
        columnLabels.innerHTML = ``;
        shoppingCart.innerHTML = ``;
        orderSummary.innerHTML= ``;
        removeAll.classList.add('hidden');
        underline.classList.add('hidden');
        footer.style.marginTop = '400px';
        message.innerHTML = `
            <h2>Basket is empty... for now ;)</h2>
            <a href="index.html">
                <button class="HomeBtn cta">Back to main page</button>
            </a>
        `
    }
}

generateCartItems();

let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
  
    if (search === undefined) {
      basket.push({
        id: selectedItem.id,
        item: 2
      })
    } else {
      search.item += 1;
    }
  
    update(selectedItem.id);
    localStorage.setItem("basket", JSON.stringify(basket));
    calculation();
    generateCartItems();
  };
  
let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);
  
    if (search === undefined || search.item <= 1) return;
    else {
      search.item -= 1;
    }
  
    update(selectedItem.id);
    localStorage.setItem("basket", JSON.stringify(basket));
    calculation();
    generateCartItems();
  };

let update = (id) => {
    let search = basket.find((x) => x.id === id);
    document.getElementById(id).innerHTML = search.item;

    calculation();
    totalAmount();
  };

let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem.id);
    
    calculation();
    generateCartItems();
    totalAmount();
    localStorage.setItem("basket", JSON.stringify(basket));
}

let clearCart = () => {
    basket = [];
    generateCartItems();
    localStorage.setItem("basket", JSON.stringify(basket));
    calculation();
}

let totalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket
            .map((x) => {
                let {item, id} = x;
                let search = shopItemsData.find((y) => y.id === id) || [];

                return item * search.price;
            })
            .reduce((x, y) => x + y); 
            orderSummary.innerHTML = `
                    <div class="desc-main">
                        <h2>ORDER SUMMARY</h2>
                        <div class="flex">
                            <p>Merchandise subtotal</p>
                            <p>${amount} USD</p>
                        </div>
                        <div class="flex">
                            <p>Shipping & Handling</p>
                            <p>FREE</p>
                        </div>
                        <div class="flex">
                            <p>Total Discount (${discount}%)<br>
                            <span class="discount">Winter Flash Sale (${discount}%)</span></p>
                            <p>-${amount * discount/100} USD</p>
                        </div>
                        <div class="single-underline"></div>
                        <div class="flex">
                            <h4>Purchase Total</h4>  
                            <h4>${amount * (100-discount)/100} USD</h4> 
                        </div>
                    </div>

                    <div class="coupon-container" method="post">
                        <form action="" class="flex coupon-form">
                            <input type="text" name="coupon" placeholder="Add a coupon (optional)" size="10">
                            <button type="submit" class="ghost-btn">Apply</button>
                        </form>    
                    </div>

                    <div class="checkout">
                        <button class="cta" onclick="openPopup()">
                            <i class="fa-solid fa-basket-shopping"></i>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
            `
    } else return;
};

totalAmount();