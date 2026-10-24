const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const storageKey = 'lr8-tasks';
const sortIncompleteButton = document.querySelector('#sort-incomplete');
const sortCompletedButton = document.querySelector('#sort-completed');

function createTask(taskText, createdAt, completed = false) {
    if (taskText === '') {
        return;
    }

    const formattedDate = createdAt.toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const taskItem = document.createElement('li');

    taskItem.dataset.text = taskText;
    taskItem.dataset.createdAt = createdAt.toISOString();

    if (completed) {
        taskItem.classList.add('completed');
    }

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = completed;
    taskCheckbox.classList.add('task-checkbox');
    taskCheckbox.setAttribute(
        'aria-label',
        'Позначити завдання виконаним'
    );

    taskCheckbox.addEventListener('change', function () {
        if (taskCheckbox.checked) {
            taskItem.classList.add('completed');
            saveTasks();
        }
    });

    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = taskText;

    taskTextElement.addEventListener('dblclick', function () {
        const editInput = document.createElement('input');

        editInput.type = 'text';
        editInput.classList.add('edit-input');
        editInput.value = taskTextElement.textContent;
        editInput.setAttribute('aria-label', 'Редагувати завдання');

        taskTextElement.replaceWith(editInput);

        editInput.focus();
        editInput.select();

        let editingFinished = false;

        function finishEditing(saveChanges) {
            if (editingFinished) {
                return;
            }

            const newText = editInput.value.trim();

            if (saveChanges && newText === '') {
                editInput.setCustomValidity('Введи текст завдання');
                editInput.reportValidity();
                return;
            }

            editingFinished = true;

            if (saveChanges) {
                taskTextElement.textContent = newText;
                taskItem.dataset.text = newText;

                saveTasks();
            }

            editInput.replaceWith(taskTextElement);
        }

        editInput.addEventListener('input', function () {
            editInput.setCustomValidity('');
        });

        editInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                finishEditing(true);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                finishEditing(false);
            }
        });

        editInput.addEventListener('blur', function () {
            finishEditing(false);
        });
    });

    const taskDateElement = document.createElement('time');
    taskDateElement.classList.add('task-date');
    taskDateElement.dateTime = createdAt.toISOString();
    taskDateElement.textContent = formattedDate;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', 'Видалити завдання');

    deleteButton.addEventListener('click', function () {
        taskItem.remove();
        saveTasks();
    });

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskTextElement);
    taskItem.appendChild(taskDateElement);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);

    // taskInput.value = '';
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        return;
    }

    createTask(taskText, new Date());

    taskInput.value = '';

    saveTasks();
}

function saveTasks() {
    const tasks = [];

    taskList.querySelectorAll('li').forEach(function (taskItem) {
        tasks.push({
            text: taskItem.dataset.text,
            createdAt: taskItem.dataset.createdAt,
            completed: taskItem.classList.contains('completed')
        });
    });

    try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
        console.error('Не вдалося зберегти завдання:', error);
    }
}

function sortTasks(completedFirst) {
    const taskItems = Array.from(taskList.children);

    taskItems.sort(function (firstTask, secondTask) {
        const firstCompleted = Number(
            firstTask.classList.contains('completed')
        );

        const secondCompleted = Number(
            secondTask.classList.contains('completed')
        );

        if (completedFirst) {
            return secondCompleted - firstCompleted;
        }

        return firstCompleted - secondCompleted;
    });

    taskItems.forEach(function (taskItem) {
        taskList.appendChild(taskItem);
    });

    saveTasks();
}

sortIncompleteButton.addEventListener('click', function () {
    sortTasks(false);
});

sortCompletedButton.addEventListener('click', function () {
    sortTasks(true);
});

function loadTasks() {
    try {
        const savedData = localStorage.getItem(storageKey);

        if (savedData === null) {
            return;
        }

        const tasks = JSON.parse(savedData);

        if (!Array.isArray(tasks)) {
            throw new Error('Збережені дані не є списком');
        }

        tasks.forEach(function (task) {
            if (
                task === null ||
                typeof task !== 'object' ||
                typeof task.text !== 'string' ||
                task.text.trim() === '' ||
                typeof task.createdAt !== 'string' ||
                typeof task.completed !== 'boolean'
            ) {
                return;
            }

            const createdAt = new Date(task.createdAt);

            if (Number.isNaN(createdAt.getTime())) {
                return;
            }

            createTask(task.text, createdAt, task.completed);
        });
    } catch (error) {
        console.error('Не вдалося відновити завдання:', error);
    }
}

taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

loadTasks();