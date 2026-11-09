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
const catalogURL = 'https://defcub.github.io/JS/Lr13/products.json';

const catalogTitle = document.querySelector('#catalog-title');
const catalogStatus = document.querySelector('#catalog-status');
const productContainer = document.querySelector('#product-container');

const priceFormat = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0
});

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    // Only fixed markup goes here. Product data is assigned below.
    card.innerHTML = `
        <div class="category"></div>
        <div class="divider"></div>
        <div class="image-container"><img></div>
        <a class="product-title" target="_blank" rel="noopener"></a>
        <p class="product-description"></p>
        <div class="price-area"></div>
        <button type="button" class="btn"></button>
    `;

    card.querySelector('.category').textContent = product.category;

    const image = card.querySelector('img');
    image.src = product.image;
    image.alt = product.name;

    const title = card.querySelector('.product-title');
    title.textContent = product.name;
    title.href = product.url;

    card.querySelector('.product-description').textContent = product.description;

    if (product.badge) {
        const badge = document.createElement('span');
        badge.classList.add('badge');
        badge.classList.add(product.badge === 'Новинка' ? 'badge-green' : 'badge-blue');
        badge.textContent = product.badge;
        card.prepend(badge);
    }

    const priceArea = card.querySelector('.price-area');
    const button = card.querySelector('button');

    if (product.price === null) {
        priceArea.textContent = 'Ціну буде оголошено';
        button.classList.add('btn-magenta');
        button.textContent = 'Незабаром у продажі';
        button.disabled = true;
        return card;
    }

    if (product.oldPrice !== undefined) {
        const oldPrice = document.createElement('span');
        oldPrice.className = 'old-price';
        oldPrice.textContent = priceFormat.format(product.oldPrice);
        priceArea.append(oldPrice);
    }

    const price = document.createElement('span');
    price.className = product.oldPrice === undefined ? 'regular-price' : 'new-price';
    price.textContent = priceFormat.format(product.price);
    priceArea.append(price);

    button.classList.add('btn-yellow');
    button.textContent = 'У корзину';

    button.addEventListener('click', function () {
        selectedProduct = {
            id: product.id,
            name: product.name,
            price: product.price
        };

        productName.textContent = product.name;
        quantityInput.value = '1';
        quantityDialog.showModal();
        quantityInput.focus();
    });

    return card;
}

async function loadCatalog() {
    catalogStatus.textContent = 'Завантаження каталогу...';

    try {
        const response = await fetch(catalogURL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const catalog = await response.json();

        if (typeof catalog.title !== 'string' || !Array.isArray(catalog.products)) {
            throw new Error('Некоректна структура каталогу');
        }

        catalogTitle.textContent = catalog.title;
        document.title = catalog.title;

        const cards = catalog.products.map(createProductCard);
        productContainer.replaceChildren(...cards);

        catalogStatus.textContent = cards.length ? '' : 'У каталозі поки немає товарів.';
    } catch (error) {
        console.error('Помилка каталогу:', error);
        catalogStatus.textContent = 'Не вдалося завантажити каталог товарів.';
    }
}

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
loadCatalog();