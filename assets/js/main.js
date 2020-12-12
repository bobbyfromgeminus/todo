'use strict';

// Változók rögzítése
const todoInput = document.querySelector('.todo-input');
const addTodoButton = document.querySelector('.add-todo');
const todoContainer = document.querySelector('.todo-container');
const completedContainer = document.querySelector('.completed-container');
const todoCounterHolder = document.querySelector('.counter');
const showHideButton = document.querySelector('.show-hide');
const clearAllButton = document.querySelector('.clear-all');
const currentDateHolder = document.querySelector('.actual-date');
let todoCounter = 0;
let storageId = 1;

// Aktuális dátum
const currentDate = () => {
    const curDate = new Date();
    const curY = curDate.getFullYear();
    let curM = curDate.getMonth() + 1;
    if (curM < 10) curM = `0${curM}`;
    let curD = curDate.getDate();
    if (curD < 10) curD = `0${curD}`;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[curDate.getDay()];
    currentDateHolder.innerHTML = `${dayName}<br>${curM}-${curD}-${curY}`;
}
currentDate();

// localStorage kezelő objektum
const storageHandler = {
    set: (key, value) => localStorage.setItem(key, value),
    get: key => localStorage.getItem(key),
    reset: key => localStorage.removeItem(key),
};

// Számláló újraindítása
const counterReset = () => {
    todoCounter = 0; 
    todoCounterHolder.textContent = todoCounter;
}

// Számláló módosítása
const counterUpdater = (direction) => {
    if (direction) todoCounter += 1;
    else todoCounter -= 1; 
    todoCounterHolder.textContent = todoCounter;
}

// Teendő törlése
const deleteTodo = (id) => {
    document.querySelector(`[data-id="${id}"]`).parentElement.remove();
    storageHandler.reset(id);
    counterUpdater(false);
}

// Teendő áthelyezésre
const todoCompleted = (id) => {
    let valueString = storageHandler.get(id);
    valueString = valueString.replace('"state":1', '"state":2');
    storageHandler.set(id, valueString);
    const targetCheckbox = document.querySelector(`[data-setid="${id}"]`);
    const targetTodo = targetCheckbox.parentElement;
    targetCheckbox.disabled = true;
    targetTodo.remove();
    completedContainer.insertBefore(targetTodo, completedContainer.firstChild);
    counterUpdater(false);
}

// Teendőn belüli eseménykezelők
const addDeleteEventListener = (id) => document.querySelector(`[data-id="${id}"]`).addEventListener('click', () => deleteTodo(id));
const addSetEventListener = (id) => document.querySelector(`[data-setid="${id}"]`).addEventListener('click', () => todoCompleted(id));

// Teendő hozzáadása localStorage-ből
const createTodo = (text, id, state, datetime) => {
    let isChecked = '';
    let parentContainer = todoContainer;
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item', 'slide-in');
    todoItem.setAttribute('title', datetime);
    if (parseInt(state) === 2) {
        parentContainer = completedContainer;
        isChecked = 'checked disabled';
    } else counterUpdater(true);
    todoItem.innerHTML = `  <input type="checkbox" ${isChecked} name="set-completed" class="set-completed" data-setid="${id}">
                            ${text}
                            <button class="delete-button" data-id="${id}"><i class="fa fa-trash"></i></button>`;
    parentContainer.insertBefore(todoItem, parentContainer.firstChild);
}

// Új teendő hozzáadása
const addTodo = () => {
    if (todoInput.value) {
        const currentDate = new Date();
        createTodo(todoInput.value, storageId, 1, currentDate);
        storageHandler.set(storageId.toString(), JSON.stringify({todo: todoInput.value, state: 1, createDate: currentDate, }));
        addDeleteEventListener(storageId);
        addSetEventListener(storageId);
        todoInput.value = '';
        storageId += 1;
    }
}

// Teendő lista felépítése locasStorage-ből az oldal betöltésekor
const buildTodoList = () => {
    Object.keys(localStorage).forEach((key) => {
        const obj = JSON.parse(storageHandler.get(key));
        createTodo(obj.todo, key, obj.state);
        addDeleteEventListener(key);
        addSetEventListener(key);
        if(parseInt(key) >= storageId) storageId = parseInt(key) + 1;
    });
}
buildTodoList();

// Elvégzett teendők mutatása/elrejtése
const setShowHide = () => {
    const btnContent = showHideButton.textContent;
    if (btnContent == 'Show Complete') {
        completedContainer.classList.remove('hide');
        showHideButton.textContent = 'Hide Complete'
    } else {
        completedContainer.classList.add('hide');
        showHideButton.textContent = 'Show Complete'
    }
}

// Összes el nem végzett teendő törlése
const clearAll = () => {
    Object.keys(localStorage).forEach((key) => {
        const obj = JSON.parse(storageHandler.get(key));
        if (parseInt(obj.state) === 1) {
            storageHandler.reset(key);
            document.querySelector(`[data-setid="${key}"]`).parentElement.remove();
            counterReset();
        }
    });
}

// Eseménykezelők
const addTodoClickListener = () => addTodoButton.addEventListener('click', addTodo);
const addShowHideClickListener = () => showHideButton.addEventListener('click', setShowHide);
const clearAllClickListener = () => clearAllButton.addEventListener('click', clearAll);
addTodoClickListener();
addShowHideClickListener();
clearAllClickListener();