'use strict';

const todoInput = document.querySelector('.todo-input');
const addTodoButton = document.querySelector('.add-todo');
const todoContainer = document.querySelector('.todo-container');
let storageId = 1;

const deleteStorage = (id) => {
    document.querySelector(`[data-id="${id}"]`).parentElement.remove();
    localStorage.removeItem(id);
}

const addDeleteEventListener = (id) => document.querySelector(`[data-id="${id}"]`).addEventListener('click', () => deleteStorage(id));


const addTodo = () => {
    if (todoInput.value) {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.innerHTML = `${todoInput.value} <button class="delete-button" data-id="${storageId}">X</button>`;
        todoContainer.insertBefore(todoItem, todoContainer.firstChild);
        localStorage.setItem(storageId.toString(), todoInput.value);
        addDeleteEventListener(storageId);
        todoInput.value = '';
        storageId += 1;
    }
}

Object.keys(localStorage).forEach((key) => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    todoItem.innerHTML = `${localStorage.getItem(key)} <button class="delete-button" data-id="${key}">X</button>`;
    todoContainer.insertBefore(todoItem, todoContainer.firstChild);
    addDeleteEventListener(key);
    if(parseInt(key) >= storageId) storageId = parseInt(key) + 1;
});

const addTodoClickListener = () => addTodoButton.addEventListener('click', addTodo);
addTodoClickListener();