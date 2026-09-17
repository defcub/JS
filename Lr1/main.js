const output = document.getElementById('output');

// Допоміжна функція для очищення блоку виводу перед новим завданням
function clearOutput() {
    output.innerHTML = '';
}

// Загальні константи 
const myName = "Тарас";
const myLastName = "Кабан";
const myNumber = 7;

// --- Завдання 1 ---
document.getElementById('btn-task1').addEventListener('click', () => {
    clearOutput();
    alert('Бурмалда');
    const name = prompt("Введіть своє прізвище та ім'я");
    const ok = confirm(`Hello, ${name}!`);
    
    const p = document.createElement('p');
    p.textContent = `Результат confirm: ${ok}`;
    output.appendChild(p);
});

// --- Завдання 2 ---
document.getElementById('btn-task2').addEventListener('click', () => {
    clearOutput();
    alert('рівень 4-6 балів завдання 2');
    const userChoice = confirm('Зробіть свій вибір');
    
    const outText = document.createElement('p');
    if (userChoice) {
        outText.textContent = 'Ви натиснули ОК';
    } else {
        outText.textContent = 'Ви натиснули не Ок';
    }
    output.appendChild(outText);
});

// --- Завдання 3 ---
document.getElementById('btn-task3').addEventListener('click', () => {
    clearOutput();
    const title = document.createElement('h3');
    title.textContent = `Таблиця множення на ${myNumber}`;
    output.appendChild(title);

    for(let i = 1; i <= 10; i++) {
        const result = myNumber * i;
        const p = document.createElement('p');
        p.textContent = `${myNumber} * ${i} = ${result}`;
        output.appendChild(p);
    }
});

// --- Завдання 4 ---
document.getElementById('btn-task4').addEventListener('click', () => {
    clearOutput();
    function checkParity(number) {
        const p = document.createElement('p');
        if (number % 2 === 0) {
            p.textContent = `Число ${number} - парне`;
            p.style.color = 'green';
        } else {
            p.textContent = `Число ${number} - непарне`;
            p.style.color = 'red';
        }
        output.appendChild(p);
    }
    checkParity(myNumber);
});

// --- Завдання 5 ---
document.getElementById('btn-task5').addEventListener('click', () => {
    clearOutput();
    function generatePassword(name, number) {
        const namePart = name.slice(0, 3);
        const numberPart = number * 2;
        const password = `${namePart}${numberPart}`;

        const div = document.createElement('div');
        div.textContent = `Мій пароль: ${password}`;
        output.appendChild(div);
    }
    generatePassword(myName, myNumber);
});

// --- Завдання 6 ---
document.getElementById('btn-task6').addEventListener('click', () => {
    clearOutput();
    function calculateAverage(journalNum){
        const grade1 = Number(prompt("Введіть першу оцінку: "));
        const grade2 = Number(prompt("Введіть другу оцінку: "));
        const grade3 = Number(prompt("Введіть третю оцінку: "));
        const average = (grade1 + grade2 + grade3) / 3;

        const div = document.createElement('div');
        div.id = journalNum;
        div.textContent = `Ваш середній бал: ${average.toFixed(2)}`;
        
        output.appendChild(div);
        
        const p = document.createElement('p');
        p.textContent = `Блок створено, його id - ${div.id}`;
        output.appendChild(p);
    }
    calculateAverage(myNumber);
});

// --- Завдання 7 ---
document.getElementById('btn-task7').addEventListener('click', () => {
    clearOutput();
    const studentCount = Number(prompt("Введіть кількість студентів у групі: "));
    
    if (studentCount > 0) {
        const title = document.createElement('h3');
        title.textContent = 'Список групи:';
        output.appendChild(title);

        for (let i = 1; i <= studentCount; i++) {
            const studentName = prompt(`Введіть прізвище та ім'я студента №${i}`);
            const p = document.createElement('p'); // ВИПРАВЛЕНО: 'p' у лапках
            p.textContent = `${i}. ${studentName}`;
            output.appendChild(p);
        }
    } else {
        alert('Будь ласка, введіть коректне число студентів.');
    }
});

// --- Завдання 8 ---
document.getElementById('btn-task8').addEventListener('click', () => {
    clearOutput();
    const ul = document.createElement('ul');

    for (const letter of myName) { // ВИПРАВЛЕНО: використання однієї змінної myName
        const li = document.createElement('li');
        li.textContent = letter;
        li.style.cursor = 'pointer';
        
        li.addEventListener('mouseenter', () => {
            alert(`Літера: ${letter}`);
        });

        ul.appendChild(li);
    }
    // ВИПРАВЛЕНО: додаємо ul на сторінку ПІСЛЯ завершення циклу
    output.appendChild(ul); 
});

// --- Завдання 9 ---
document.getElementById('btn-task9').addEventListener('click', () => {
    clearOutput();
    while (true) {
        const studentName = prompt("Введіть прізвище та ім'я (або Відміна): ");
        if (studentName === null) {
            break;
        }
        const p = document.createElement('p');
        p.textContent = studentName;
        output.appendChild(p);
    }
});

// --- Завдання 10 ---
document.getElementById('btn-task10').addEventListener('click', () => {
    if (output.textContent === '' || output.textContent === "Тут з'явиться результат...") {
        output.innerHTML = ''; // Очищаємо початковий текст
        
        for (const letter of myLastName) {
            const block = document.createElement('div');
            block.textContent = letter;
            block.className = 'letter-block'; // Додаємо клас для стилів з CSS
            
            block.addEventListener('mouseenter', () => {
                alert(`Це літера ${letter}`);
            });
            output.appendChild(block);
        }
    } else {
        output.textContent = '';
    }
});