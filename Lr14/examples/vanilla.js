const selector = document.querySelector('#language-selector');
const status = document.querySelector('#status');
const elements = document.querySelectorAll('[data-i18n]');

async function loadLanguage(language) {
    selector.disabled = true;
    status.textContent = '';

    try {
        const response = await fetch(`../locales/${language}.json`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const translations = await response.json();

        for (const element of elements) {
            const key = element.dataset.i18n;
            element.textContent = translations[key];
        }

        document.documentElement.lang = language;
    } catch (error) {
        console.error('Помилка завантаження перекладу:', error);
        status.textContent = 'Не вдалося завантажити переклад.';
        selector.value = document.documentElement.lang;
    } finally {
        selector.disabled = false;
    }
}

selector.addEventListener('change', function () {
    loadLanguage(selector.value);
});

loadLanguage('en');