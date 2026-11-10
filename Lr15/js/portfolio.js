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

const adminPanel = document.querySelector('#project-admin');
const roleStatus = document.querySelector('#portfolio-role');
const cancelProject = document.querySelector('#cancel-project');
const formHeading = document.querySelector('#form-heading');

let isAdmin = false;
let editingId = null;
let saving = false;

function resetProjectForm() {
    editingId = null;
    form.reset();
    formHeading.textContent = 'Додати проєкт';
    submitButton.textContent = 'Додати проєкт';
    cancelProject.hidden = true;
}

function startEditing(project) {
    if (!isAdmin || saving) return;

    editingId = project.id;
    titleInput.value = project.title;
    descriptionInput.value = project.description;
    categoryInput.value = project.category;

    formHeading.textContent = 'Редагувати проєкт';
    submitButton.textContent = 'Зберегти зміни';
    cancelProject.hidden = false;
    formStatus.textContent = '';
    titleInput.focus();
}

cancelProject.addEventListener('click', function () {
    resetProjectForm();
    formStatus.textContent = 'Редагування скасовано.';
});

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
        if (isAdmin) {
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.textContent = 'Редагувати';
            editButton.disabled = saving;
            editButton.addEventListener('click', () => startEditing(project));

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Видалити';
            deleteButton.disabled = saving;
            deleteButton.addEventListener('click', () => deleteProject(project));

            item.append(editButton, deleteButton);
        }
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

async function changeProject(action, successMessage) {
    if (!isAdmin || saving) return;

    saving = true;

    const formControls = form.querySelectorAll('input, textarea, select, button');
    formControls.forEach(control => control.disabled = true);
    list.querySelectorAll('button').forEach(button => button.disabled = true);

    formStatus.textContent = 'Виконується запит...';

    try {
        const { error } = await action();
        if (error) throw error;

        resetProjectForm();
        formStatus.textContent = successMessage;
        await loadProjects();
    } catch (error) {
        console.error('Помилка зміни проєкту:', error);
        formStatus.textContent = 'Операцію не виконано. Перевірте права та з’єднання.';
    } finally {
        saving = false;
        formControls.forEach(control => control.disabled = false);
        list.querySelectorAll('button').forEach(button => button.disabled = false);
    }
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!isAdmin || saving) return;

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;

    if (!title || title.length > 150 ||
        !description || description.length > 500 ||
        !['website', 'application'].includes(category)) {
        formStatus.textContent = 'Перевірте назву, опис і категорію.';
        return;
    }

    const values = { title, description, category };

    if (editingId === null) {
        changeProject(
            () => db.from('portfolio_projects').insert(values).select('id').single(),
            'Проєкт додано.'
        );
    } else {
        changeProject(
            () => db.from('portfolio_projects')
                .update(values).eq('id', editingId).select('id').single(),
            'Зміни збережено.'
        );
    }
});

function deleteProject(project) {
    if (!isAdmin || saving) return;
    if (!window.confirm(`Видалити проєкт «${project.title}»?`)) return;

    changeProject(
        () => db.from('portfolio_projects')
            .delete().eq('id', project.id).select('id').single(),
        'Проєкт видалено.'
    );
}

async function openPortfolio() {
    adminPanel.hidden = true;
    submitButton.disabled = true;

    try {
        const { data, error } = await db.auth.getSession();
        if (error) throw error;

        if (data.session) {
            const { data: admin, error: roleError } = await db.rpc('check_admin');
            if (roleError) throw roleError;

            isAdmin = admin === true;
            roleStatus.textContent = isAdmin
                ? 'Адміністратор. Доступне керування проєктами.'
                : 'Користувач. Доступний перегляд.';
        } else {
            roleStatus.textContent = 'Гість. Доступний перегляд.';
        }
    } catch (error) {
        console.error('Помилка перевірки ролі:', error);
        roleStatus.textContent = 'Не вдалося перевірити роль. Доступний перегляд.';
    }

    adminPanel.hidden = !isAdmin;
    await loadProjects();
    submitButton.disabled = !isAdmin;
}

await loadProjects();
submitButton.disabled = false;