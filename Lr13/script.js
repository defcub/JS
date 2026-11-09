const storageKey = 'lr13-cart';

const cartButton = document.querySelector('#cart-button');
const cartCount = document.querySelector('#cart-count');
const emptyDialog = document.querySelector('#empty-dialog');
const quantityDialog = document.querySelector('#quantity-dialog');
const addedDialog = document.querySelector('#added-dialog');

const productName = document.querySelector('#product-name');
const quantityForm = document.querySelector('#quantity-form');
const quantityInput = document.querySelector('#quantity');
const cancelButton = document.querySelector('#cancel-button');

let selectedProduct;

// читання кошику
function readCart() {
    const savedCart = localStorage.getItem(storageKey);
    return savedCart === null ? [] : JSON.parse(savedCart);
}

function updateCartCount() {
    cartCount.textContent = readCart().length;
}

// користувач вибирає телефон
document.querySelectorAll('.btn-yellow[data-id]').forEach(function (button) {
    button.addEventListener('click', function () {
        const card = button.closest('.product-card');

        selectedProduct = {
            id: button.dataset.id,
            name: card.querySelector('.product-title').textContent.trim(),
            price: Number(button.dataset.price)
        };

        productName.textContent = selectedProduct.name;
        quantityInput.value = '1';
        quantityDialog.showModal();
        quantityInput.focus();
    });
});

cancelButton.addEventListener('click', function () {
    quantityDialog.close();
});

// корристувач підтверджує кількість
quantityForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const quantity = quantityInput.valueAsNumber;
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
        return;
    }
    const cart = readCart();
    const existingProduct = cart.find(function (product) {
        return product.id === selectedProduct.id;
    });
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: quantity
        });
    }

    localStorage.setItem(storageKey, JSON.stringify(cart));
    updateCartCount();

    quantityDialog.close();
    addedDialog.showModal();
});

// іконка або показує повідомлення, або відкриває сторінку кошика
cartButton.addEventListener('click', function () {
    if (readCart().length === 0) {
        emptyDialog.showModal();
    } else {
        window.location.href = 'cart.html';
    }
});

window.addEventListener('pageshow', updateCartCount);