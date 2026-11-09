const selector = document.querySelector('#language-selector');
const status = document.querySelector('#status');
const elements = document.querySelectorAll('[data-i18n]');

const resources = {
    en: {
        translation: {
            greeting: 'Hello',
            farewell: 'Goodbye',
            language: 'Language'
        }
    },
    uk: {
        translation: {
            greeting: 'Привіт',
            farewell: 'До побачення',
            language: 'Мова'
        }
    }
};

function updateContent() {
    for (const element of elements) {
        element.textContent = i18next.t(element.dataset.i18n);
    }

    document.documentElement.lang = i18next.language;
}

async function start() {
    selector.disabled = true;

    try {
        await i18next.init({
            lng: 'en',
            fallbackLng: 'en',
            resources
        });

        updateContent();

        selector.addEventListener('change', async function () {
            await i18next.changeLanguage(selector.value);
            updateContent();
        });

        selector.disabled = false;
    } catch (error) {
        console.error('Помилка ініціалізації i18next:', error);
        status.textContent = 'Не вдалося запустити i18next.';
    }
}

start();