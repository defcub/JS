const storageKey = 'lr13-cart';

const cart = JSON.parse(localStorage.getItem(storageKey) || '[]');

const rows = document.querySelector('#cart-rows');
const cartContent = document.querySelector('#cart-content');
const emptyMessage = document.querySelector('#empty-message');
const totalCell = document.querySelector('#cart-total');
const checkout = document.querySelector('#checkout');
const checkoutAmount = document.querySelector('#checkout-amount');

function formatPrice(value) {
    return new Intl.NumberFormat(shopText('uk-UA', 'en-GB'), {
        style: 'currency',
        currency: 'UAH'
    }).format(value);
}

function saveCart() {
    localStorage.setItem(storageKey, JSON.stringify(cart));
}

function updateTotal() {
    let total = 0;

    cart.forEach(function (product) {
        total += product.price * product.quantity;
    });

    totalCell.textContent = formatPrice(total);
}

function renderCart() {
    rows.replaceChildren();

    const isEmpty = cart.length === 0;
    emptyMessage.hidden = !isEmpty;
    cartContent.hidden = isEmpty;

    cart.forEach(function (product, index) {
        const row = rows.insertRow();

        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = product.name;
        row.insertCell().textContent = formatPrice(product.price);

        const quantityCell = row.insertCell();
        const quantityInput = document.createElement('input');

        quantityInput.type = 'number';
        quantityInput.min = '1';
        quantityInput.step = '1';
        quantityInput.required = true;
        quantityInput.value = product.quantity;
        quantityInput.setAttribute(
            'aria-label',
            `${shopText('Кількість', 'Quantity')}: ${product.name}`
        );

        quantityCell.appendChild(quantityInput);

        const subtotalCell = row.insertCell();
        subtotalCell.textContent = formatPrice(
            product.price * product.quantity
        );

        quantityInput.addEventListener('change', function () {
            const quantity = quantityInput.valueAsNumber;

            if (!Number.isSafeInteger(quantity) || quantity < 1) {
                quantityInput.reportValidity();
                quantityInput.value = product.quantity;
                return;
            }

            product.quantity = quantity;
            saveCart();

            subtotalCell.textContent = formatPrice(product.price * quantity);
            updateTotal();
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Видалити';
        deleteButton.textContent = shopText('Видалити', 'Remove');
        deleteButton.setAttribute(
            'aria-label',
            `${shopText('Видалити', 'Remove')}: ${product.name}`
        );

        deleteButton.addEventListener('click', function () {
            cart.splice(index, 1);
            saveCart();
            renderCart();
        });

        row.insertCell().appendChild(deleteButton);
    });

    updateTotal();
}

document.querySelector('#pay-link').addEventListener('click', function (event) {
    event.preventDefault();

    checkoutAmount.textContent =
    `${shopText('До оплати', 'Amount due')}: ${totalCell.textContent}`;
    checkout.showModal();
});

initShopLanguage(function () {
    document.title = shopText('Кошик товарів', 'Shopping cart');
    renderCart();
});