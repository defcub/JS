import { db } from './db.js';

const status = document.querySelector('#status');
const list = document.querySelector('#books-list');

async function loadBooks() {
    status.textContent = 'Завантаження книг...';
    list.replaceChildren();

    try {
        const { data, error } = await db
            .from('books')
            .select('id, title, author')
            .order('id', { ascending: true });

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            status.textContent = 'Книг поки немає.';
            return;
        }

        for (const book of data) {
            const item = document.createElement('li');
            item.textContent = `${book.title} — ${book.author}`;
            list.append(item);
        }   

        status.textContent = `Знайдено книг: ${data.length}`;
        } catch (error) {
            console.error('Помилка завантаження книг:', error);
            status.textContent = 'Не вдалося завантажити книги. Перевірте консоль.';
        }
    }







    const bookForm = document.querySelector('#book-form');
    const titleInput = document.querySelector('#title');
    const authorInput = document.querySelector('#author');
    const submitButton = bookForm.querySelector('button[type="submit"]');

    bookForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (submitButton.disabled) return;

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();

        if (title.length === 0 || title.length > 150 ||
            author.length === 0 || author.length > 150) {
            status.textContent = 'Назва книги та автор мають містити від 1 до 150 символів.';
            return;
        }

        submitButton.disabled = true;
        status.textContent = 'Додавання книги...';

        try {
            const { error } = await db
                .from('books')
                .insert({ title, author });

            if (error) throw error;

            bookForm.reset();
            await loadBooks();
        } catch (error) {
            console.error('Помилка додавання книги:', error);
            status.textContent = 'Не вдалося додати книгу. Перевірте підключення та консоль.';
        } finally {
            submitButton.disabled = false;
        }
    });

    submitButton.disabled = false;
    loadBooks();