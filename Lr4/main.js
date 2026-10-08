// ЗАВДАННЯ 1

let book = {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    year: 1997,
    isRead: true,

    bookInfo() {
        let status = this.isRead ? "Так" : "Ні"; 
        console.log(`Назва: ${this.title}, Автор: ${this.author}, Рік видання: ${this.year}, Прочитана: ${status}`);
    }
};

console.log("--- Перший виклик ---");
book.bookInfo();
book.isRead = !book.isRead; 

console.log("--- Другий виклик (після зміни) ---");
book.bookInfo();

// ЗАВДАННЯ 2

const infoMethod = function() {
    let status = this.isRead ? "Так" : "Ні";
    console.log(`Назва: ${this.title}, Автор: ${this.author}, Рік: ${this.year}, Прочитана: ${status}`);
};
let library = [
    { title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, isRead: false, bookInfo: infoMethod },
    { title: "1984", author: "George Orwell", year: 1949, isRead: true, bookInfo: infoMethod },
    { title: "Harry Potter", author: "J.K. Rowling", year: 1997, isRead: true, bookInfo: infoMethod }
];
function displayLibrary() {
    console.log("--- Список книг у бібліотеці ---");
    library.forEach(book => book.bookInfo());
}
displayLibrary();

library.push({ 
    title: "The Great Gatsby", 
    author: "F. Scott Fitzgerald", 
    year: 1925, 
    isRead: false, 
    bookInfo: infoMethod 
});

console.log("\n--- Після додавання нової книги ---");
displayLibrary();

// ЗАВДАННЯ 3

library.sort((a, b) => a.year - b.year);
console.log("Відсортовані книги за роком");
console.log(library);
let unreadBooks = library.filter(book => book.isRead === false);
console.log("Непрочитані книги");
console.log(unreadBooks);м
let tolkienBook = library.find(book => book.author === "J.R.R. Tolkien");

console.log("Книга Толкіна");
console.log(tolkienBook);


// ЗАВДАННЯ 4

function addBookToLibrary() {
    let newTitle = prompt("Введіть назву книги:");
    let newAuthor = prompt("Введіть автора книги:");
    let newYear = Number(prompt("Введіть рік видання книги:"));
    let newIsRead = confirm("Чи прочитана книга? (ОК - Так, Скасувати - Ні)");
    library.push({ 
        title: newTitle, 
        author: newAuthor, 
        year: newYear, 
        isRead: newIsRead,
        bookInfo: infoMethod
    });

    console.log("--- Бібліотека після додавання вашої книги ---");
    displayLibrary();
}

addBookToLibrary();


// ЗАВДАННЯ 5

//метод markAsRead
let extraBook = {
    title: "The Witcher",
    isRead: false,
    markAsRead() {
        this.isRead = true;
        console.log(`Книгу "${this.title}" тепер прочитано!`);
    }
};

extraBook.markAsRead();
console.log(extraBook.isRead);
function calculateAverageYear() {
    let sum = 0;
    library.forEach(book => {
        sum += book.year;
    });
    return Math.round(sum / library.length);
}
console.log(`Середній рік видання книг у бібліотеці: ${calculateAverageYear()}`);


// ІНДИВІДУАЛЬНЕ

let comicsCollection = [
    { title: "Batman: The Killing Joke", author: "Alan Moore", publisher: "DC", year: 1988, inCollection: true },
    { title: "Spider-Man: Blue", author: "Jeph Loeb", publisher: "Marvel", year: 2002, inCollection: false },
    { title: "Watchmen", author: "Alan Moore", publisher: "DC", year: 1986, inCollection: true }
];

function displayComics() {
    console.log("=== Моя колекція коміксів ===");
    comicsCollection.forEach(comic => {
        let status = comic.inCollection ? "Так" : "Ні";
        console.log(`Назва: ${comic.title} | Автор: ${comic.author} | Видавництво: ${comic.publisher} | Рік: ${comic.year} | В колекції: ${status}`);
    });
}
displayComics();
comicsCollection.sort((a, b) => a.year - b.year);
console.log("\nВідсортовано за роком:", comicsCollection);

let missingComics = comicsCollection.filter(comic => comic.inCollection === false);
console.log("Комікси, які треба докупити:", missingComics);

let marvelComic = comicsCollection.find(comic => comic.publisher === "Marvel");
console.log("Знайдено комікс Marvel:", marvelComic);

function addComicToCollection() {
    let newTitle = prompt("Введіть назву коміксу:");
    let newAuthor = prompt("Введіть автора:");
    let newPublisher = prompt("Введіть видавництво:");
    let newYear = Number(prompt("Введіть рік випуску:"));
    let newInCollection = confirm("Він вже є у вашій колекції?");

    comicsCollection.push({
        title: newTitle,
        author: newAuthor,
        publisher: newPublisher,
        year: newYear,
        inCollection: newInCollection
    });

    console.log("\n=== Оновлений список після додавання ===");
    displayComics();
}
// addComicToCollection();  