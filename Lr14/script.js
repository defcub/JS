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

const categoryEnglish = {
    'Автономність': 'Battery life',
    'Флагман': 'Flagship',
    'Камерофон': 'Camera phone',
    'Бюджетний': 'Budget',
    'Дизайн': 'Design'
};

const badgeEnglish = {
    'Новинка': 'New',
    'Хіт продажів': 'Bestseller'
};

const descriptionEnglish = {
    'moto-g54-power': 'This model is coming soon.',
    'iphone-15-pro': 'The standard iPhone 15 Pro offer.',
    'xiaomi-14-ultra': 'A smartphone for mobile photography.',
    'galaxy-a15': 'An affordable model from the Galaxy A series.',
    'google-pixel-9a': 'A Google Pixel smartphone in Iris.',
    'nothing-phone-2a': 'A transparent back with two centrally positioned cameras.'
};

function formatPrice(value) {
    return new Intl.NumberFormat(shopText('uk-UA', 'en-GB'), {
        style: 'currency',
        currency: 'UAH',
        maximumFractionDigits: 0
    }).format(value);
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML = `
        <div class="category"></div>
        <div class="divider"></div>
        <div class="image-container"><img></div>
        <a class="product-title" target="_blank" rel="noopener"></a>
        <p class="product-description"></p>
        <div class="price-area"></div>
        <button type="button" class="btn"></button>
    `;

    card.querySelector('.category').textContent =
        shopText(product.category, categoryEnglish[product.category] ?? product.category);

    card.querySelector('.product-description').textContent =
        shopText(product.description, descriptionEnglish[product.id] ?? product.description);

    const image = card.querySelector('img');
    image.src = product.image;
    image.alt = product.name;

    const title = card.querySelector('.product-title');
    title.textContent = product.name;
    title.href = product.url;

    if (product.badge) {
        const badge = document.createElement('span');
        badge.classList.add('badge');
        badge.classList.add(product.badge === 'Новинка' ? 'badge-green' : 'badge-blue');
        badge.textContent = shopText(product.badge, badgeEnglish[product.badge] ?? product.badge);
        card.prepend(badge);
    }

    const priceArea = card.querySelector('.price-area');
    const button = card.querySelector('button');

    if (product.price === null) {
        priceArea.textContent = shopText('Ціну буде оголошено', 'Price to be announced');
        button.classList.add('btn-magenta');
        button.textContent = shopText('Незабаром у продажі', 'Coming soon');
        button.disabled = true;
        return card;
    }

    if (product.oldPrice !== undefined) {
        const oldPrice = document.createElement('span');
        oldPrice.className = 'old-price';
        oldPrice.textContent = formatPrice(product.oldPrice);
        priceArea.append(oldPrice);
    }

    const price = document.createElement('span');
    price.className = product.oldPrice === undefined ? 'regular-price' : 'new-price';
    price.textContent = formatPrice(product.price);
    priceArea.append(price);

    button.classList.add('btn-yellow');
    button.textContent = shopText('У корзину', 'Add to cart');

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

let catalogData = null;
let catalogLoading = false;

async function loadCatalog() {
    document.title = shopText('Каталог смартфонів', 'Smartphone catalog');

    if (!catalogData) {
        catalogStatus.textContent = shopText(
            'Завантаження каталогу...',
            'Loading catalog...'
        );

        if (catalogLoading) return;
        catalogLoading = true;

        try {
            const response = await fetch(catalogURL);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (typeof data.title !== 'string' || !Array.isArray(data.products)) {
                throw new Error('Некоректна структура каталогу');
            }

            catalogData = data;
        } catch (error) {
            console.error('Помилка каталогу:', error);
            catalogStatus.textContent = shopText(
                'Не вдалося завантажити каталог товарів.',
                'Could not load the product catalog.'
            );
            return;
        } finally {
            catalogLoading = false;
        }
    }

    const title = shopText(catalogData.title, 'Smartphone catalog');
    catalogTitle.textContent = title;
    document.title = title;

    const cards = catalogData.products.map(createProductCard);
    productContainer.replaceChildren(...cards);

    catalogStatus.textContent = cards.length
        ? ''
        : shopText('У каталозі поки немає товарів.', 'The catalog is empty.');
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
initShopLanguage(loadCatalog);