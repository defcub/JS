const loader = document.querySelector('#loader');
const result = document.querySelector('#result');
const buttons = document.querySelectorAll('button');

const checkInput = document.querySelector('#check-input');
const firstNumber = document.querySelector('#first-number');
const secondNumber = document.querySelector('#second-number');

// Завдання 0. Спільний показ очікування та результату
function runTask(startTask) {
    result.textContent = '';
    loader.style.display = 'block';

    buttons.forEach(function (button) {
        button.disabled = true;
    });

    return Promise.resolve()
        .then(startTask)
        .then(function (message) {
            result.textContent = message;
        })
        .catch(function (error) {
            result.textContent = error.message;
        })
        .finally(function () {
            loader.style.display = 'none';

            buttons.forEach(function (button) {
                button.disabled = false;
            });
        });
}

// Завдання 1. Привітання через 2 секунди
function getGreeting() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve('Hello, World!');
        }, 2000);
    });
}

// Завдання 2. Перевірка числа
function checkNumber(num) {
    return new Promise(function (resolve, reject) {
        if (num > 10) {
            resolve('Число більше 10');
        } else {
            reject(new Error('Число менше або дорівнює 10'));
        }
    });
}

// Випадкове ціле число від 1 до max включно
function randomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Завдання 3. Випадкове число від 1 до 100 через 1–3 секунди
function randomNumber() {
    const delay = randomInteger(3) * 1000;

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(randomInteger(100));
        }, delay);
    });
}

// Завдання 4. Порівняння після затримки в 1 секунду
function compareNumbers(num1, num2) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (num1 > num2) {
                resolve('Перше число більше');
            } else if (num1 < num2) {
                resolve('Друге число більше');
            } else {
                reject(new Error('Числа рівні'));
            }
        }, 1000);
    });
}

// Завдання 5. Кожен Promise повертає число від 1 до 10
function getNumberAfter(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(randomInteger(10));
        }, delay);
    });
}

function sumThreeNumbers() {
    const promises = [
        getNumberAfter(1000),
        getNumberAfter(2000),
        getNumberAfter(3000)
    ];

    return Promise.all(promises).then(function (numbers) {
        const sum = numbers[0] + numbers[1] + numbers[2];

        return `${numbers.join(' + ')} = ${sum}`;
    });
}

// Кнопки
document.querySelector('#greeting-button').addEventListener('click', function () {
    runTask(getGreeting);
});

document.querySelector('#check-button').addEventListener('click', function () {
    if (checkInput.reportValidity()) {
        runTask(function () {
            return checkNumber(checkInput.valueAsNumber);
        });
    }
});

document.querySelector('#random-button').addEventListener('click', function () {
    runTask(function () {
        const start = performance.now();

        return randomNumber().then(function (number) {
            const seconds = (performance.now() - start) / 1000;

            return `Число: ${number}. Час роботи: ${seconds.toFixed(2)} с`;
        });
    });
});

document.querySelector('#compare-button').addEventListener('click', function () {
    if (firstNumber.reportValidity() && secondNumber.reportValidity()) {
        runTask(function () {
            return compareNumbers(
                firstNumber.valueAsNumber,
                secondNumber.valueAsNumber
            );
        });
    }
});

document.querySelector('#sum-button').addEventListener('click', function () {
    runTask(sumThreeNumbers);
});

// Перше привітання запускається при відкритті сторінки
runTask(getGreeting);