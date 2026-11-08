import { db } from './db.js';

const list = document.querySelector('#project-list');
const catalogStatus = document.querySelector('#catalog-status');
const searchInput = document.querySelector('#project-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#project-sort');

const form = document.querySelector('#project-form');
const titleInput = document.querySelector('#project-title');
const descriptionInput = document.querySelector('#project-description');
const categoryInput = document.querySelector('#project-category');
const submitButton = form.querySelector('button[type="submit"]');
const formStatus = document.querySelector('#form-status');

const categoryLabels = {
    website: 'Вебсайт',
    application: 'Застосунок'
};

let projects = [];

function renderProjects() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const visibleProjects = projects.filter(function (project) {
        const text = `${project.title} ${project.description}`.toLowerCase();
        const matchesSearch = text.includes(search);
        const matchesCategory = category === 'all' || project.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sortSelect.value === 'az') {
        visibleProjects.sort((a, b) => a.title.localeCompare(b.title, 'uk'));
    } else if (sortSelect.value === 'za') {
        visibleProjects.sort((a, b) => b.title.localeCompare(a.title, 'uk'));
    }

    list.replaceChildren();

    for (const project of visibleProjects) {
        const item = document.createElement('li');

        const title = document.createElement('strong');
        title.textContent = project.title;

        const categoryText = document.createElement('span');
        categoryText.textContent = ` — ${categoryLabels[project.category]}`;

        const description = document.createElement('p');
        description.textContent = project.description;

        item.append(title, categoryText, description);
        list.append(item);
    }

    if (projects.length === 0) {
        catalogStatus.textContent = 'У каталозі поки немає проєктів.';
    } else if (visibleProjects.length === 0) {
        catalogStatus.textContent = 'За вашим запитом проєктів не знайдено.';
    } else {
        catalogStatus.textContent =
            `Показано проєктів: ${visibleProjects.length} із ${projects.length}.`;
    }
}

async function loadProjects() {
    catalogStatus.textContent = 'Завантаження проєктів...';
    searchInput.disabled = true;
    categoryFilter.disabled = true;
    sortSelect.disabled = true;

    try {
        const { data, error } = await db
            .from('portfolio_projects')
            .select('id, title, description, category')
            .order('id', { ascending: true });

        if (error) throw error;

        projects = data;
        renderProjects();

        searchInput.disabled = false;
        categoryFilter.disabled = false;
        sortSelect.disabled = false;
    } catch (error) {
        console.error('Помилка завантаження:', error);
        list.replaceChildren();
        catalogStatus.textContent =
            'Не вдалося завантажити каталог. Перевірте з’єднання й оновіть сторінку.';
    }
}

searchInput.addEventListener('input', renderProjects);
categoryFilter.addEventListener('change', renderProjects);
sortSelect.addEventListener('change', renderProjects);

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (submitButton.disabled) return;

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;

    if (!title || title.length > 150 ||
        !description || description.length > 500 ||
        !['website', 'application'].includes(category)) {
        formStatus.textContent =
            'Перевірте назву, опис і категорію проєкту.';
        return;
    }

    submitButton.disabled = true;
    formStatus.textContent = 'Додавання проєкту...';

    try {
        const { error } = await db
            .from('portfolio_projects')
            .insert({ title, description, category });

        if (error) throw error;

        form.reset();
        formStatus.textContent = `Проєкт «${title}» додано.`;
        await loadProjects();
    } catch (error) {
        console.error('Помилка додавання:', error);
        formStatus.textContent =
            'Не вдалося додати проєкт. Перевірте консоль браузера.';
    } finally {
        submitButton.disabled = false;
    }
});

await loadProjects();
submitButton.disabled = false;