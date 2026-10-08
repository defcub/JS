const fahrenheitInput = document.getElementById('fahrenheit');
const celsiusInput = document.getElementById('celsius');

fahrenheitInput.addEventListener('input', () => {
    if (fahrenheitInput.value === '') {
        celsiusInput.value = '';
        return;
    }
    const fValue = parseFloat(fahrenheitInput.value);
    const cValue = (5 / 9) * (fValue - 32);
    celsiusInput.value = cValue.toFixed(2);
});

celsiusInput.addEventListener('input', () => {
    if (celsiusInput.value === '') {
        fahrenheitInput.value = '';
        return;
    }
    const cValue = parseFloat(celsiusInput.value);
    const fValue = (cValue * 9 / 5) + 32;
    fahrenheitInput.value = fValue.toFixed(2);
});



// 2 ЗАВДАННЯ

let correctAnswers = 0;
let totalQuestions = 0;
let currentCorrectAnswer = 0;

const scoreText = document.getElementById('score');
const taskText = document.getElementById('taskText');
const answerInput = document.getElementById('answer');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const resultMsg = document.getElementById('resultMsg');

function generateTask() {
    const num1 = Math.floor(Math.random() * 8) + 2; 
    const num2 = Math.floor(Math.random() * 8) + 2; 
    currentCorrectAnswer = num1 * num2;
    taskText.textContent = `${num1} × ${num2} = `;

    answerInput.value = '';
    resultMsg.textContent = '';

    answerInput.disabled = false;
    checkBtn.disabled = false;
}

checkBtn.addEventListener('click', () => {
    if (answerInput.value === '') 
        return;

    totalQuestions++;
    const userAnswer = Number(answerInput.value);
    
    if (userAnswer === currentCorrectAnswer) {
        correctAnswers++;
        resultMsg.textContent = 'Правильно!';
        resultMsg.style.color = 'green';
    } else {
        resultMsg.textContent = `Помилка, правильна відповідь «${currentCorrectAnswer}»`;
        resultMsg.style.color = 'red';
    }
    const percent = Math.round((correctAnswers / totalQuestions) * 100);
    scoreText.textContent = `Загальний рахунок ${percent}% (${correctAnswers} правильних відповідей з ${totalQuestions})`;
    answerInput.disabled = true;
    checkBtn.disabled = true;
});

nextBtn.addEventListener('click', generateTask);
generateTask();



// 3 ЗАВДАННЯ


let correct3 = 0;
let total3 = 0;
let ans3 = 0;

const score3 = document.getElementById('score3');
const taskText3 = document.getElementById('taskText3');
const radioContainer = document.getElementById('radioContainer');
const resultMsg3 = document.getElementById('resultMsg3');

function generateTask3() {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    ans3 = n1 * n2;
    
    taskText3.textContent = `${n1} × ${n2} = `;
    resultMsg3.textContent = '';
    
    let options = [ans3];
    while (options.length < 4) {
        let wrong = (Math.floor(Math.random() * 8) + 2) * (Math.floor(Math.random() * 8) + 2);
        if (!options.includes(wrong)) {
            options.push(wrong);
        }
    }
    options.sort(() => Math.random() - 0.5);

    radioContainer.innerHTML = '';
    options.forEach(opt => {
        radioContainer.innerHTML += `
            <label style="display:block; cursor:pointer; margin-bottom:5px;">
                <input type="radio" name="mathAns" value="${opt}"> ${opt}
            </label>
        `;
    });
}

radioContainer.addEventListener('change', (e) => {
    total3++;
    const userAns = Number(e.target.value);
    
    if (userAns === ans3) {
        correct3++;
        resultMsg3.textContent = 'Правильно!';
        resultMsg3.style.color = 'green';
    } else {
        resultMsg3.textContent = `Помилка, правильна відповідь «${ans3}»`;
        resultMsg3.style.color = 'red';
    }
    
    const percent = Math.round((correct3 / total3) * 100);
    score3.textContent = `Загальний рахунок ${percent}% (${correct3} правильних з ${total3})`;

    const radios = document.querySelectorAll('input[name="mathAns"]');
    radios.forEach(r => r.disabled = true);
});

document.getElementById('nextBtn3').addEventListener('click', generateTask3);
generateTask3();


// 4 ЗАВДАННЯ

const phonesArray = [
    { 
        path: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', 
        title: 'iPhone', 
        description: 'Смартфон Apple' 
    },
    { 
        path: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=500', 
        title: 'Samsung Galaxy', 
        description: 'Флагман на базі Android' 
    },
    { 
        path: 'https://images.pexels.com/photos/1786433/pexels-photo-1786433.jpeg?auto=compress&cs=tinysrgb&w=500', 
        title: 'Google Pixel', 
        description: 'Камерофон з чистим Android' 
    }
];

function initPhotoRotator(containerId, imagesArray) {
    const container = document.getElementById(containerId);
    let currentIndex = 0;

    // Головна обгортка з рамкою
    const wrapper = document.createElement('div');
    wrapper.style.border = '1px solid #ddd';
    wrapper.style.textAlign = 'center';

    // ВЕРХНЯ ПАНЕЛЬ
    const topBar = document.createElement('div');
    topBar.style.padding = '10px';
    topBar.style.borderBottom = '1px solid #ddd';
    const counter = document.createElement('span');
    topBar.appendChild(counter);

    // СЕРЕДНЯ ПАНЕЛЬ
    const middleBar = document.createElement('div');
    middleBar.style.display = 'flex';
    middleBar.style.justifyContent = 'space-between';
    middleBar.style.alignItems = 'center';
    middleBar.style.padding = '15px';
    middleBar.style.minHeight = '300px';

    const btnPrev = document.createElement('a');
    btnPrev.textContent = 'Назад';
    btnPrev.style.cursor = 'pointer';
    btnPrev.style.color = 'blue';
    btnPrev.style.textDecoration = 'underline';

    const img = document.createElement('img');
    img.style.maxHeight = '280px';
    img.style.maxWidth = '70%';

    const btnNext = document.createElement('a');
    btnNext.textContent = 'Вперед';
    btnNext.style.cursor = 'pointer';
    btnNext.style.color = 'blue';
    btnNext.style.textDecoration = 'underline';

    middleBar.appendChild(btnPrev);
    middleBar.appendChild(img);
    middleBar.appendChild(btnNext);

    // НИЖНЯ ПАНЕЛЬ
    const bottomBar = document.createElement('div');
    bottomBar.style.padding = '10px';
    bottomBar.style.borderTop = '1px solid #ddd';
    
    const titleElement = document.createElement('div');
    titleElement.style.fontWeight = 'bold';
    titleElement.style.marginBottom = '5px';
    
    const descElement = document.createElement('div');
    
    bottomBar.appendChild(titleElement);
    bottomBar.appendChild(descElement);



    wrapper.appendChild(topBar);
    wrapper.appendChild(middleBar);
    wrapper.appendChild(bottomBar);
    container.appendChild(wrapper);


    // Функція, яка оновлює картинку і текст залежно від currentIndex
    function updateView() {
        const currentData = imagesArray[currentIndex];
        
        counter.textContent = `Фотографія ${currentIndex + 1} з ${imagesArray.length}`;
        img.src = currentData.path;
        titleElement.textContent = currentData.title;
        descElement.textContent = currentData.description;

        btnPrev.style.visibility = (currentIndex === 0) ? 'hidden' : 'visible';
        btnNext.style.visibility = (currentIndex === imagesArray.length - 1) ? 'hidden' : 'visible';
    }

    btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateView();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentIndex < imagesArray.length - 1) {
            currentIndex++;
            updateView();
        }
    });
    updateView();
}

initPhotoRotator('rotator', phonesArray);


// 5 ЗАВДАННЯ



// 1. Карта пікселів для цифр 0-9. Кожна цифра - це сітка 3х5
// 1 - це червоний квадратик, 0 - пусте місце.
const pixelsMap = [
    [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1], // 0
    [0,1,0, 1,1,0, 0,1,0, 0,1,0, 1,1,1], // 1
    [1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1], // 2
    [1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1], // 3
    [1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1], // 4
    [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1], // 5
    [1,1,1, 1,0,0, 1,1,1, 1,0,1, 1,1,1], // 6
    [1,1,1, 0,0,1, 0,1,0, 0,1,0, 0,1,0], // 7
    [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,1,1], // 8
    [1,1,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1]  // 9
];

let currentCaptcha = "";
const box = document.getElementById('captchaBox');
const input = document.getElementById('captchaInput');
const result = document.getElementById('captchaResult');

function initCaptcha(length) {
    box.innerHTML = ''; 
    currentCaptcha = "";
    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * 10);
        currentCaptcha += randomNum;

        const digitContainer = document.createElement('div');
        digitContainer.style.display = 'grid';
        digitContainer.style.gridTemplate = 'repeat(5, 10px) / repeat(3, 10px)'; 
        
        pixelsMap[randomNum].forEach(bit => {
            const span = document.createElement('span');
            span.style.backgroundColor = bit ? 'red' : 'transparent';
            digitContainer.appendChild(span);
        });

        box.appendChild(digitContainer);
    }
}

initCaptcha(2);

document.getElementById('checkCaptchaBtn').addEventListener('click', () => {
    if (input.value === currentCaptcha) {
        result.textContent = 'Правильно';
        result.style.color = 'green';
        input.value = '';
        initCaptcha(2);
    } else {
        result.textContent = 'Помилка';
        result.style.color = 'red';
    }
});
