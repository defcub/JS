const languageKey = 'lr14-language';
let shopLanguage = 'uk';

function shopText(ukrainian, english) {
    return shopLanguage === 'en' ? english : ukrainian;
}

function initShopLanguage(updatePage) {
    const dialog = document.querySelector('#language-dialog');
    const selector = document.querySelector('#shop-language');

    const labels = Array.from(document.querySelectorAll('[data-en]'), element => ({
        element,
        uk: element.textContent,
        en: element.dataset.en
    }));

    function applyLanguage(language) {
        shopLanguage = language;
        document.documentElement.lang = language;
        selector.value = language;

        for (const label of labels) {
            label.element.textContent = shopText(label.uk, label.en);
        }

        document.body.classList.remove('language-pending');
        updatePage();
    }

    function chooseLanguage(language) {
        localStorage.setItem(languageKey, language);

        if (dialog.open) {
            dialog.close();
        }

        applyLanguage(language);
    }

    dialog.querySelectorAll('[data-language]').forEach(function (button) {
        button.addEventListener('click', function () {
            chooseLanguage(button.dataset.language);
        });
    });

    dialog.addEventListener('cancel', event => event.preventDefault());

    selector.addEventListener('change', function () {
        chooseLanguage(selector.value);
    });

    const savedLanguage = localStorage.getItem(languageKey);

    if (savedLanguage === 'uk' || savedLanguage === 'en') {
        applyLanguage(savedLanguage);
    } else {
        dialog.showModal();
    }

    window.addEventListener('pageshow', function (event) {
        if (!event.persisted) return;

        const language = localStorage.getItem(languageKey);
        if (language === 'uk' || language === 'en') {
            applyLanguage(language);
        }
    });
}