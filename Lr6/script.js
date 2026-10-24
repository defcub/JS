//ПОШУК DOM-ЕЛЕМЕНТІВ

// Вкладки
const tabsContainer = document.querySelector('#tabs');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Повзунки заокруглення
const topLeft = document.querySelector('#top-left');
const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right');
const bottomLeft = document.querySelector('#bottom-left');

// Підписи біля повзунків
const topLeftValue = document.querySelector('#top-left-value');
const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value');
const bottomLeftValue = document.querySelector('#bottom-left-value');

// Властивості
const paddingInput = document.querySelector('#padding');
const paddingValue = document.querySelector('#padding-value');
const textTransform = document.querySelector('#text-transform');

// Попередній перегляд
const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const coordinates = document.querySelector('#coordinates');

// css-код
const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');

// Форма
const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');

// Кнопка повернення вгору
const scrollTopButton = document.querySelector('#scroll-top');

// повзунки радіусів у порядку CSS
const radiusInputs = [
    topLeft,
    topRight,
    bottomRight,
    bottomLeft
];

// Усі повзунки сторінки, включно з padding
const allRangeInputs = document.querySelectorAll(
    'input[type="range"]'
);


// ПЕРЕМИКАННЯ ВКЛАДОК

function hideTabs() {
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });

    tabContents.forEach(function (content) {
        content.classList.remove('active');
    });
}

function showTab(tabName) {
    const selectedTab = document.querySelector(
        `[data-tab="${tabName}"]`
    );

    const selectedContent = document.querySelector(
        `[data-content="${tabName}"]`
    );

    selectedTab.classList.add('active');
    selectedContent.classList.add('active');
}

tabsContainer.addEventListener('click', function (event) {
    if (!event.target.classList.contains('tab')) {
        return;
    }

    console.log('Тип події:', event.type);
    console.log('Джерело події:', event.target);
    console.log('Елемент з обробником:', event.currentTarget);

    const tabName = event.target.dataset.tab;

    hideTabs();
    showTab(tabName);
});


// ФОРМУВАННЯ ЗНАЧЕННЯ BORDER-RADIUS

function getBorderRadiusValue() {
    return radiusInputs
        .map(function (input) {
            return `${input.value}px`;
        })
        .join(' ');
}


// ФОРМУВАННЯ ПОВНОГО CSS-КОДУ

function updateCSSCode() {
    const radius = getBorderRadiusValue();

    cssCode.value =
        `border-radius: ${radius};\n` +
        `padding: ${paddingInput.value}px;\n` +
        `text-transform: ${textTransform.value};`;

    copyMessage.textContent = '';
}


// ГЕНЕРАТОР BORDER-RADIUS

function generateBorderRadius() {
    const radius = getBorderRadiusValue();

    preview.style.borderRadius = radius;

    topLeftValue.textContent = `${topLeft.value} px`;
    topRightValue.textContent = `${topRight.value} px`;
    bottomRightValue.textContent = `${bottomRight.value} px`;
    bottomLeftValue.textContent = `${bottomLeft.value} px`;

    updateCSSCode();
}

radiusInputs.forEach(function (input) {
    input.addEventListener('input', generateBorderRadius);
});


// ГЕНЕРАТОР PADDING

function generatePadding() {
    preview.style.padding = `${paddingInput.value}px`;
    paddingValue.textContent = `${paddingInput.value} px`;
    updateCSSCode();
}

paddingInput.addEventListener('input', generatePadding);


// ГЕНЕРАТОР TEXT-TRANSFORM

function generateTextTransform() {
    preview.style.textTransform = textTransform.value;
    updateCSSCode();
}

textTransform.addEventListener(
    'change',
    generateTextTransform
);


// ПЕРЕВІРКА НАЗВИ ПРЕСЕТА

function validatePresetName() {
    const name = presetName.value.trim();

    if (name === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';

        return false;
    }

    presetName.classList.remove('error');
    presetError.textContent = '';

    return true;
}

presetName.addEventListener('focus', function () {
    presetName.classList.add('focused');
});

presetName.addEventListener('blur', function () {
    presetName.classList.remove('focused');

    validatePresetName();
});


// ОБРОБКА ВІДПРАВЛЕННЯ ФОРМИ

function handlePresetSubmit(event) {
    event.preventDefault();

    if (!validatePresetName()) {
        presetName.focus();
        return;
    }

    console.log(`Пресет: ${presetName.value.trim()}`);
    console.log(cssCode.value);
}

presetForm.addEventListener('submit', handlePresetSubmit);


// СКИДАННЯ ПОВЗУНКІВ ЧЕРЕЗ ESCAPE

function handleKeyDown(event) {
    if (event.key === 'Escape') {
        allRangeInputs.forEach(function (input) {
            input.value = '0';
        });

        generateBorderRadius();
        generatePadding();
    }
}

document.addEventListener('keydown', handleKeyDown);


// КОПІЮВАННЯ CSS-КОДУ

async function copyCSS() {
    try {
        await navigator.clipboard.writeText(cssCode.value);

        copyMessage.textContent = 'CSS-код скопійовано';
    } catch (error) {
        copyMessage.textContent =
            'Не вдалося скопіювати автоматично. ' +
            'Код виділено — натисни Ctrl+C.';

        cssCode.focus();
        cssCode.select();
    }
}

copyButton.addEventListener('click', copyCSS);


// ПОШИРЕННЯ ПОДІЙ

preview.addEventListener('click', function () {
    console.log('Preview click');
});

previewButton.addEventListener('click', function (event) {
    event.stopPropagation();

    console.log('Button click');
});


// НАВЕДЕННЯ МИШІ НА PREVIEW

preview.addEventListener('mouseover', function () {
    preview.classList.add('hovered');
});

preview.addEventListener('mouseout', function (event) {
    if (
        event.relatedTarget &&
        preview.contains(event.relatedTarget)
    ) {
        return;
    }

    preview.classList.remove('hovered');
});


// КООРДИНАТИ КУРСОРА

preview.addEventListener('mousemove', function (event) {
    coordinates.textContent =
        `X: ${event.clientX}; Y: ${event.clientY}`;

    console.log(
        `pageX: ${event.pageX}; pageY: ${event.pageY}`
    );
});

// ПРОКРУЧУВАННЯ ТА ПОВЕРНЕННЯ ВГОРУ

function handleScroll() {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);

scrollTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// ПОЧАТКОВЕ НАЛАШТУВАННЯ СТОРІНКИ

hideTabs();
showTab('radius');

generateBorderRadius();
generatePadding();
generateTextTransform();

handleScroll();