// =======================================================
// РІВЕНЬ 1
// =======================================================

// ЗАВДАННЯ 1
function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`; 
}
function showGreeting(fullName, age) {
    alert(`Hello, ${fullName}! You are ${age} years old.`);
}
document.getElementById('btn-l1-t1').addEventListener('click', () => {
    const firstNameInput = prompt("Введіть ваше ім'я:");
    const lastNameInput = prompt("Введіть ваше прізвище:");
    const ageInput = prompt("Введіть ваш вік:");
    const userFullName = getFullName(firstNameInput, lastNameInput);
    showGreeting(userFullName, ageInput);
});

// ЗАВДАННЯ 2
function getStudentInfo() {
    const name = prompt("Введіть ім'я студента:");
    const score = Number(prompt("Введіть бал студента (від 0 до 12):"));
    return { name: name, score: score }; 
}
function checkGrade(score) {
    if (score >= 10 && score <= 12) return "Excellent";
    else if (score >= 7 && score <= 9) return "Good";
    else if (score >= 4 && score <= 6) return "Satisfactory";
    else if (score >= 0 && score < 4) return "Fail";
    else return "Invalid score";
}
function showResultGrade(name, grade) {
    alert(`Student: ${name}\nGrade: ${grade}`);
    console.log(`Student: ${name}\nGrade: ${grade}`);
}
document.getElementById('btn-l1-t2').addEventListener('click', () => {
    const studentData = getStudentInfo();
    const finalGrade = checkGrade(studentData.score);
    showResultGrade(studentData.name, finalGrade);
});

// ЗАВДАННЯ 3
function calculateTip(amount, percent = 10) {
    return amount * (percent / 100);
}
function showResultTip(amount, tip) {
    const total = amount + tip;
    const percent = (tip / amount) * 100;
    const message = `Bill: ${amount} грн\nTip (${percent}%): ${tip} грн\nTotal: ${total} грн`;
    alert(message);
    console.log(message);
}
document.getElementById('btn-l1-t3').addEventListener('click', () => {
    const billAmount = Number(prompt("Введіть загальну суму рахунку (грн):"));
    if (billAmount > 0) {
        const tipAmount = calculateTip(billAmount);
        showResultTip(billAmount, tipAmount);
    } else {
        alert("Будь ласка, введіть коректну суму!");
    }
});


// =======================================================
// РІВЕНЬ 2
// =======================================================

// ЗАВДАННЯ 1
function startGreetingTimer(message, seconds, callback) {
    console.log(`Таймер запущено на ${seconds} секунд...`);
    setTimeout(() => {
        console.log(message);
        callback();
    }, seconds * 1000);
}
document.getElementById('btn-l2-t1').addEventListener('click', () => {
    startGreetingTimer("Привіт! Час вийшов.", 3, () => alert('Time is up!'));
});

// ЗАВДАННЯ 2
function calculate(a, b, operation) {
    let result; 
    switch (operation) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': 
            if (b === 0) return "Помилка: ділення на нуль!";
            result = a / b; break;
        default: return 'Invalid operation';
    }
    return result;
}
document.getElementById('btn-l2-t2').addEventListener('click', () => {
    const num1 = Number(prompt("Введіть перше число:"));
    const num2 = Number(prompt("Введіть друге число:"));
    const op = prompt("Введіть операцію (+, -, *, /):");
    const calcResult = calculate(num1, num2, op);
    alert(`Результат: ${calcResult}`);
    console.log(`Виконано: ${num1} ${op} ${num2} = ${calcResult}`);
});

// ЗАВДАННЯ 3
function createClickCounter() {
    let count = 0; 
    return function() {
        count++;
        console.log(`Клік. Поточне значення: ${count}`);
    };
}
document.getElementById('btn-l2-t3').addEventListener('click', () => {
    const myCounter = createClickCounter();
    console.log("Запуск лічильника");
    myCounter(); 
    myCounter(); 
    myCounter(); 
    myCounter();
    const anotherCounter = createClickCounter();
    anotherCounter();
    alert("Результати лічильника виведено в консоль (F12)");
});


// =======================================================
// РІВЕНЬ 3
// =======================================================

// ЗАВДАННЯ 1
function* randomGenerator(min, max) {
    while (true) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        yield randomNum;
    }
}
let numberGen;
document.getElementById('btn-l3-t1-setup').addEventListener('click', () => {
    const minBound = Number(prompt("Генератор: Введіть мінімальне число:"));
    const maxBound = Number(prompt("Генератор: Введіть максимальне число:"));
    numberGen = randomGenerator(minBound, maxBound);
    document.getElementById('next').disabled = false; // Розблоковуємо кнопку Next
    alert("Генератор готовий! Натискайте 'Next number'");
});

const btnNext = document.getElementById('next');
const outDiv = document.getElementById('out');
btnNext.addEventListener('click', () => {
    const result = numberGen.next(); 
    outDiv.textContent = `Згенеровано число: ${result.value}`;
    console.log(`Згенеровано число: ${result.value}`);
});


// ЗАВДАННЯ 2
function* passwordGenerator() {
    let password = ''; 
    while (true) {
        const char = yield; 
        if (char === 'done') return password; 
        if (char) password += char;
    }
}
function buildPassword() {
    const passGen = passwordGenerator();
    passGen.next(); 
    while (true) {
        const input = prompt("Введіть символ для пароля (або напишіть 'done' для завершення):");
        const result = passGen.next(input);
        if (result.done) {
            alert(`Ваш згенерований пароль: ${result.value}`);
            console.log(`Готовий пароль: ${result.value}`);
            break;
        }
    }
}
document.getElementById('btn-l3-t2').addEventListener('click', buildPassword);


// ЗАВДАННЯ 3
function* chatBot() {
    const name = yield "Hi! What is your name?";
    const mood = yield `Nice to meet you, ${name}! How are you?`;
    return "Goodbye!";
}
function startChat() {
    const bot = chatBot();
    let chatStep = bot.next();
    while (!chatStep.done) {
        const userAnswer = prompt(chatStep.value);
        if (userAnswer === null) {
            alert("Діалог перервано.");
            return;
        }
        chatStep = bot.next(userAnswer);
    }
    alert(chatStep.value);
}
document.getElementById('btn-l3-t3').addEventListener('click', startChat);


// ЗАВДАННЯ 4
document.getElementById('btn-l3-t4-setup').addEventListener('click', () => {
    const userName = prompt("Введіть ваше ім'я для кнопки 'Say':");
    const user = {
        name: userName || 'Гість', 
        say() { 
            alert(`Hello, ${this.name}`); 
            console.log(`Hello, ${this.name}`); 
        }
    };
    const btnHello = document.getElementById('hello');
    btnHello.disabled = false;
    btnHello.onclick = user.say.bind(user);
    alert("Ім'я збережено! Тепер натискайте 'Say'");
});