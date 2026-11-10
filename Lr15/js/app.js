import { db } from './db.js';

const byId = id => document.getElementById(id);

const controls = byId('controls');
const authForm = byId('auth-form');
const authStatus = byId('auth-status');
const logoutButton = byId('logout');

const list = byId('books-list');
const listStatus = byId('list-status');
const bookForm = byId('book-form');
const bookStatus = byId('book-status');
const titleInput = byId('title');
const authorInput = byId('author');
const saveButton = byId('save');
const cancelButton = byId('cancel');

let isAdmin = false;
let editingId = null;

async function runAction(action, status, errorMessage) {
    if (controls.disabled) return;

    controls.disabled = true;

    try {
        await action();
    } catch (error) {
        console.error(errorMessage, error);
        status.textContent = errorMessage;
    } finally {
        controls.disabled = false;
    }
}

function resetBookForm() {
    editingId = null;
    bookForm.reset();
    byId('form-heading').textContent = 'Додати книгу';
    saveButton.textContent = 'Додати книгу';
    cancelButton.hidden = true;
}

function startEditing(book) {
    editingId = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;

    byId('form-heading').textContent = 'Редагувати книгу';
    saveButton.textContent = 'Зберегти зміни';
    cancelButton.hidden = false;
    bookStatus.textContent = '';
    titleInput.focus();
}

async function loadBooks() {
    listStatus.textContent = 'Завантаження книг...';
    list.replaceChildren();

    try {
        const { data, error } = await db
            .from('books')
            .select('id, title, author')
            .order('id', { ascending: true });

        if (error) throw error;

        for (const book of data) {
            const item = document.createElement('li');
            const text = document.createElement('span');
            text.textContent = `${book.title} — ${book.author}`;
            item.append(text);

            if (isAdmin) {
                const editButton = document.createElement('button');
                editButton.type = 'button';
                editButton.textContent = 'Редагувати';
                editButton.addEventListener('click', () => startEditing(book));

                const deleteButton = document.createElement('button');
                deleteButton.type = 'button';
                deleteButton.textContent = 'Видалити';
                deleteButton.addEventListener('click', () => deleteBook(book));

                item.append(editButton, deleteButton);
            }

            list.append(item);
        }

        listStatus.textContent = data.length
            ? `Знайдено книг: ${data.length}`
            : 'Книг поки немає.';
    } catch (error) {
        console.error('Помилка читання:', error);
        listStatus.textContent = 'Не вдалося завантажити список книг.';
    }
}

async function refreshAccount() {
    isAdmin = false;
    resetBookForm();
    bookStatus.textContent = '';
    byId('admin-panel').hidden = true;
    list.replaceChildren();

    const { data: sessionData, error: sessionError } = await db.auth.getSession();
    if (sessionError) throw sessionError;

    if (!sessionData.session) {
        byId('user-info').textContent = 'Гість. Каталог доступний для перегляду.';
        authForm.hidden = false;
        logoutButton.hidden = true;
    } else {
        const { data, error } = await db.auth.getUser();
        if (error) throw error;

        authForm.hidden = true;
        logoutButton.hidden = false;
        byId('user-info').textContent = data.user.email;

        const { data: admin, error: roleError } = await db.rpc('check_admin');

        if (roleError) {
            console.error('Помилка перевірки ролі:', roleError);
            authStatus.textContent = 'Не вдалося перевірити роль. Доступний перегляд.';
        } else {
            isAdmin = admin === true;
            const role = isAdmin ? 'Адміністратор' : 'Користувач';
            byId('user-info').textContent = `${data.user.email} — ${role}`;
        }

        byId('admin-panel').hidden = !isAdmin;
    }

    await loadBooks();
}

// Вхід та реєстрація
authForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const register = event.submitter?.value === 'register';
    const credentials = {
        email: byId('email').value.trim(),
        password: byId('password').value
    };

    runAction(async function () {
        authStatus.textContent = register ? 'Реєстрація...' : 'Вхід...';

        const { data, error } = register
            ? await db.auth.signUp(credentials)
            : await db.auth.signInWithPassword(credentials);

        if (error) throw error;

        authForm.reset();

        if (register && !data.session) {
            authStatus.textContent = 'Перевірте пошту для підтвердження реєстрації.';
            return;
        }

        authStatus.textContent = 'Вхід виконано.';
        await refreshAccount();
    }, authStatus, register
        ? 'Не вдалося зареєструватися. Перевірте введені дані.'
        : 'Не вдалося увійти. Перевірте пошту та пароль.');
});

logoutButton.addEventListener('click', function () {
    runAction(async function () {
        const { error } = await db.auth.signOut();
        if (error) throw error;

        authStatus.textContent = 'Ви вийшли з облікового запису.';
        await refreshAccount();
    }, authStatus, 'Не вдалося завершити сеанс.');
});

bookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!isAdmin) return;

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author || title.length > 150 || author.length > 150) {
        bookStatus.textContent = 'Назва й автор мають містити від 1 до 150 символів.';
        return;
    }

    runAction(async function () {
        const editing = editingId !== null;
        bookStatus.textContent = 'Збереження...';

        const query = editing
            ? db.from('books').update({ title, author }).eq('id', editingId)
            : db.from('books').insert({ title, author });

        const { error } = await query.select('id').single();
        if (error) throw error;

        resetBookForm();
        bookStatus.textContent = editing ? 'Зміни збережено.' : 'Книгу додано.';
        await loadBooks();
    }, bookStatus, 'Не вдалося зберегти книгу. Введені дані залишилися у формі.');
});

cancelButton.addEventListener('click', function () {
    resetBookForm();
    bookStatus.textContent = 'Редагування скасовано.';
});

function deleteBook(book) {
    if (!isAdmin || !window.confirm(`Видалити «${book.title}»?`)) return;

    runAction(async function () {
        const { error } = await db
            .from('books')
            .delete()
            .eq('id', book.id)
            .select('id')
            .single();

        if (error) throw error;

        if (editingId === book.id) resetBookForm();

        bookStatus.textContent = 'Книгу видалено.';
        await loadBooks();
    }, bookStatus, 'Не вдалося видалити книгу.');
}

try {
    await refreshAccount();
} catch (error) {
    console.error('Помилка перевірки сеансу:', error);
    authStatus.textContent = 'Не вдалося перевірити сеанс. Оновіть сторінку.';
    await loadBooks();
} finally {
    controls.disabled = false;
}