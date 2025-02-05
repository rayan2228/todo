const addBtnElm = document.querySelector('.add-btn');
const inputElm = document.querySelector('.task-input');
const searchElm = document.querySelector('.search-input');
const taskListElm = document.querySelector('.task-list');
const editBtnElm = document.querySelector('.edit-btn');
const deleteBtnElm = document.querySelector('.delete-btn');
const completeBtnElm = document.querySelector('.complete-btn');
const undoBtnElm = document.querySelector('.undo-btn');
const messageElm = document.querySelector('.message');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editId = null;
const addEventListeners = () => {
    addBtnElm.addEventListener('click', addTask);
    inputElm.addEventListener('keydown', inputChanges)
    searchElm.addEventListener('input', searchTask);
}

const inputChanges = (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
    messageElm.textContent = '';
}

const addTask = () => {
    const task = inputElm.value;
    const id = Date.now();
    if (task === '') {
        messageElm.textContent = 'Please enter a task';
        return;
    }
    if (editId || editId === 0) {
        tasks[editId].task = inputElm.value;
        editId = null;
    } else {
        tasks.push({ id, task, completed: false });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    inputElm.value = '';
    renderTasks();
}



const renderTasks = (filteredTasks) => {
    let finalTasks = filteredTasks || tasks;
    taskListElm.innerHTML = '';
    finalTasks.map((task, index) => {
        const taskElm = document.createElement('li');
        taskElm.classList.add('task');
        taskElm.innerHTML = `
            <span class="task-name ${task.completed ? 'completed' : ''}" >${index + 1}  ${task.task}</span>
             <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            ${task.completed ? `<button class="undo-btn" onclick="undoTask(${task.id})">Undo</button>` : `<button class="complete-btn" onclick="completeTask(${task.id})">Complete</button>`}
            </div>
        `;
        taskListElm.appendChild(taskElm);
    })
    if (editId || editId === 0) {
        addBtnElm.textContent = 'Update';
    } else {
        addBtnElm.textContent = 'Add';
    }
    messageElm.textContent = tasks.length === 0 ? 'No tasks available' : "";
}

const deleteTask = (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

const completeTask = (id) => {
    const index = tasks.findIndex((task) => task.id === id);
    console.log(index);

    tasks[index].completed = true;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

const undoTask = (id) => {
    const index = tasks.findIndex((task) => task.id === id);
    console.log(index);

    tasks[index].completed = false;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

const editTask = (id) => {
    const index = tasks.findIndex((task) => task.id === id);
    inputElm.value = tasks[index].task;
    editId = index;
    renderTasks();
}

const searchTask = () => {
    const search = searchElm.value.toLowerCase();
    let filteredTasks = tasks.filter((task) => task.task.toLowerCase().includes(search));
    if (search === '') {
        filteredTasks = tasks;
    }
    renderTasks(filteredTasks);
}


renderTasks()
addEventListeners();
