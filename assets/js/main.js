'use strict';

const todoInput = document.querySelector('.todo-input');
const addTodoButton = document.querySelector('.add-todo');
const todoContainer = document.querySelector('.todo-container');
const completedContainer = document.querySelector('.completed-container');
const todoCounterHolder = document.querySelector('.counter');
const showHideButton = document.querySelector('.show-hide');
const clearAllButton = document.querySelector('.clear-all');

let todoCounter = 0;
let storageId = 1;


const counterReset = () => {
    todoCounter = 0; 
    todoCounterHolder.textContent = todoCounter;
}

const counterUpdater = (direction) => {
    if (direction) todoCounter += 1;
    else todoCounter -= 1; 
    todoCounterHolder.textContent = todoCounter;
}


const deleteTodo = (id) => {
    document.querySelector(`[data-id="${id}"]`).parentElement.remove();
    localStorage.removeItem(id);
    counterUpdater(false);
}

const todoCompleted = (id) => {
    let valueString = localStorage.getItem(id);
    valueString = valueString.replace('"state":1', '"state":2');
    localStorage.setItem(id, valueString);
    const targetCheckbox = document.querySelector(`[data-setid="${id}"]`);
    const targetTodo = targetCheckbox.parentElement;
    targetCheckbox.disabled = true;
    targetTodo.remove();
    completedContainer.insertBefore(targetTodo, completedContainer.firstChild);
    counterUpdater(false);

}


const addDeleteEventListener = (id) => document.querySelector(`[data-id="${id}"]`).addEventListener('click', () => deleteTodo(id));

const addSetEventListener = (id) => document.querySelector(`[data-setid="${id}"]`).addEventListener('click', () => todoCompleted(id));


const createTodo = (text, id, state, datetime) => {
    let isChecked = '';
    let parentContainer = todoContainer;
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    todoItem.setAttribute('title', datetime);
    if (parseInt(state) === 2) {
        parentContainer = completedContainer;
        isChecked = 'checked disabled';
    } else {
        counterUpdater(true);
    }
    todoItem.innerHTML = `<input type="checkbox" ${isChecked} name="set-completed" class="set-completed" data-setid="${id}"> ${text} <button class="delete-button" data-id="${id}">X</button>`;
    parentContainer.insertBefore(todoItem, parentContainer.firstChild);
}

const addTodo = () => {
    if (todoInput.value) {
        const currentDate = new Date();
        createTodo(todoInput.value, storageId, 1, currentDate);

        localStorage.setItem(storageId.toString(), JSON.stringify(
            {
                todo: todoInput.value,
                state: 1,   // 1, ha aktív a feladat | 2, ha inaktív
                createDate: currentDate, 
            }
        )
        );
        addDeleteEventListener(storageId);
        addSetEventListener(storageId);
        todoInput.value = '';
        storageId += 1;
    }
}

// Az oldal betöltésekor átfutjuk a localStorage-et
Object.keys(localStorage).forEach((key) => {
    const obj = JSON.parse(localStorage.getItem(key));
    createTodo(obj.todo, key, obj.state);
    addDeleteEventListener(key);
    addSetEventListener(key);
    if(parseInt(key) >= storageId) storageId = parseInt(key) + 1;
});

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

const clearAll = () => {
    Object.keys(localStorage).forEach((key) => {
        const obj = JSON.parse(localStorage.getItem(key));
        if (parseInt(obj.state) === 1) {
            localStorage.removeItem(key);
            document.querySelector(`[data-setid="${key}"]`).parentElement.remove();
            counterReset();
        }
    });
}

const addTodoClickListener = () => addTodoButton.addEventListener('click', addTodo);

const addShowHideClickListener = () => showHideButton.addEventListener('click', setShowHide);

const clearAllClickListener = () => clearAllButton.addEventListener('click', clearAll);

addTodoClickListener();
addShowHideClickListener();
clearAllClickListener();