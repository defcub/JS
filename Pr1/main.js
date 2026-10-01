const output = document.getElementById('output');

function clearOutput() {
    output.innerHTML = '';
}


function printToOutput(title, data) {
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    titleElement.style.margin = '15px 0 5px 0';
    output.appendChild(titleElement);

    if (data !== undefined) {
        const dataElement = document.createElement('pre');
        dataElement.textContent = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
        output.appendChild(dataElement);
    }
}



// --- Завдання 1 ---
const products = [
    { name: "Ноутбук", category: "Електроніка", price: 25000, inStock: 5 },
    { name: "Мишка", category: "Електроніка", price: 800, inStock: 0 },
    { name: "Стіл", category: "Меблі", price: 4000, inStock: 12 },
    { name: "Крісло", category: "Меблі", price: 3500, inStock: 0 },
    { name: "Клавіатура", category: "Електроніка", price: 1500, inStock: 3 }
];
function getAvailableProducts(productsArray) { return productsArray.filter(product => product.inStock > 0); }
function findProductByName(productsArray, productName) {
    const foundProduct = productsArray.find(product => product.name === productName);
    return foundProduct !== undefined ? foundProduct : "Товар не знайдено";
}

// --- Завдання 2 ---
const students = [
    { name: "Олександр", age: 19, grade: 85, group: "ПЗ-21" },
    { name: "Марія", age: 20, grade: 92, group: "КІ-21" },
    { name: "Тарас", age: 18, grade: 95, group: "ПЗ-21" },
    { name: "Ірина", age: 19, grade: 78, group: "КІ-21" },
    { name: "Олег", age: 21, grade: 88, group: "ПЗ-22" }
];
function groupBy(studentsArray) {
    return studentsArray.reduce((acc, student) => {
        if (!acc[student.group]) { acc[student.group] = []; }
        acc[student.group].push(student);
        return acc;
    }, {});
}
function sortStudentsByGrade(studentsArray) { return [...studentsArray].sort((a, b) => b.grade - a.grade); }

// --- Завдання 3 ---
const employees = [
    { name: "Олена", position: "Менеджер", salary: 25000, years: 5 },
    { name: "Андрій", position: "Розробник", salary: 35000, years: 2 },
    { name: "Вікторія", position: "Аналітик", salary: 30000, years: 7 },
    { name: "Дмитро", position: "Дизайнер", salary: 28000, years: 4 },
    { name: "Марина", position: "HR", salary: 22000, years: 10 }
];
function getAverageSalary(employeesArray) {
    const totalSalary = employeesArray.reduce((sum, employee) => sum + employee.salary, 0);
    return totalSalary / employeesArray.length;
}
function findMostExperiencedEmployee(employeesArray) {
    return employeesArray.reduce((mostExperienced, currentEmployee) => {
        return currentEmployee.years > mostExperienced.years ? currentEmployee : mostExperienced;
    }); 
}

// --- Завдання 4 ---
const books = [
    { title: "Основи програмування", author: "Олександр Іванов", year: 2018, rating: 4.2, isRead: true },
    { title: "JavaScript для початківців", author: "Марія Петренко", year: 2021, rating: 4.8, isRead: false },
    { title: "React у дії", author: "Марія Петренко", year: 2023, rating: 4.9, isRead: false },
    { title: "Бази даних SQL", author: "Тарас Коваленко", year: 2015, rating: 3.9, isRead: true },
    { title: "Чистий код", author: "Роберт Мартін", year: 2008, rating: 5.0, isRead: false }
];
function getUnreadBooks(booksArray) {
    return booksArray.reduce((acc, book) => {
        if (book.isRead === false) { acc.push(book.title); }
        return acc;
    }, []);
}
function getBooksByAuthor(booksArray, authorName) {
    const authorBooks = booksArray.reduce((acc, book) => {
        if (book.author === authorName) { acc.push(book); }
        return acc;
    }, []);
    return authorBooks.sort((a, b) => a.year - b.year);
}
function getTopRatedBooks(booksArray) {
    const topBooks = booksArray.reduce((acc, book) => {
        if (book.rating > 4) { acc.push(book); }
        return acc;
    }, []);
    return topBooks.sort((a, b) => b.rating - a.rating);
}

// --- Завдання 5 ---
const orders = [
    { orderId: 101, customer: { name: "Тарас", email: "taras@mail.com" }, items: ["Ноутбук", "Мишка"], total: 25800 },
    { orderId: 102, customer: { name: "Олена", email: "olena@mail.com" }, items: ["Монітор"], total: 7000 },
    { orderId: 103, customer: { name: "Тарас", email: "taras@mail.com" }, items: ["Клавіатура", "Килимок"], total: 2000 },
    { orderId: 104, customer: { name: "Олег", email: "oleg@mail.com" }, items: ["Смартфон"], total: 15000 }
];
function getTotalSpentByCustomer(ordersArray, customerName) {
    const customerOrders = ordersArray.filter(order => order.customer.name === customerName);
    return customerOrders.reduce((sum, order) => sum + order.total, 0);
}

// --- Завдання 6 ---
const items = [
    { itemId: 1, name: "Ноутбук", price: 25000 },
    { itemId: 2, name: "Мишка", price: 800 },
    { itemId: 3, name: "Клавіатура", price: 1500 }
];
const purchases = [
    { purchaseId: 101, itemId: 1, quantity: 2 },
    { purchaseId: 102, itemId: 2, quantity: 5 },
    { purchaseId: 103, itemId: 1, quantity: 1 },
    { purchaseId: 104, itemId: 3, quantity: 3 }
];
function getTotalSales(itemsArray, purchasesArray) {
    return purchasesArray.reduce((acc, purchase) => {
        const item = itemsArray.find(p => p.itemId === purchase.itemId);
        if (item) {
            const revenue = item.price * purchase.quantity;
            if (!acc[item.name]) { acc[item.name] = 0; }
            acc[item.name] += revenue;
        }
        return acc;
    }, {});
}

// ==========================================
// ПІДКЛЮЧЕННЯ КНОПОК
// ==========================================

document.getElementById('btn-task1').addEventListener('click', () => {
    clearOutput();
    printToOutput("Товари в наявності:", getAvailableProducts(products));
    printToOutput("Пошук товару 'Стіл':", findProductByName(products, "Стіл"));
    printToOutput("Пошук товару 'Монітор':", findProductByName(products, "Монітор"));
});

document.getElementById('btn-task2').addEventListener('click', () => {
    clearOutput();
    printToOutput("Групування студентів:", groupBy(students));
    printToOutput("Сортування за оцінками (спадання):", sortStudentsByGrade(students));
});

document.getElementById('btn-task3').addEventListener('click', () => {
    clearOutput();
    printToOutput("Середня зарплата:", `${getAverageSalary(employees)} грн`);
    const veteran = findMostExperiencedEmployee(employees);
    printToOutput("Найдосвідченіший працівник:", `${veteran.name} (${veteran.years} років досвіду)`);
});

document.getElementById('btn-task4').addEventListener('click', () => {
    clearOutput();
    printToOutput("Непрочитані книги:", getUnreadBooks(books));
    printToOutput("Книги Марії Петренко (за роком):", getBooksByAuthor(books, "Марія Петренко"));
    printToOutput("Топові книги (рейтинг > 4):", getTopRatedBooks(books));
});

document.getElementById('btn-task5').addEventListener('click', () => {
    clearOutput();
    printToOutput("Витрати клієнта 'Тарас':", `${getTotalSpentByCustomer(orders, "Тарас")} грн`);
    printToOutput("Витрати клієнта 'Олена':", `${getTotalSpentByCustomer(orders, "Олена")} грн`);
});

document.getElementById('btn-task6').addEventListener('click', () => {
    clearOutput();
    printToOutput("Загальний дохід від продажу товарів:", getTotalSales(items, purchases));
});