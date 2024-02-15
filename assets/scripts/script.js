"use strict"

class ToDoApp {

    _titleField = null
    _descriptionField = null
    _submitButton = null
    _todoList = null

    _title = ''
    _description = ''
    _list = [];

    _filter = 'all'
    _filterButtons = null

    constructor() {

        this._titleField = document.getElementById('todo-title')
        this._descriptionField = document.getElementById('todo-description')
        this._submitButton = document.getElementById('todo-submit')
        this._todoList = document.getElementById('todo-list')
        this._filterButtons = document.querySelectorAll('.app-filter button')

        this._titleField.addEventListener('input', (e) => this.setTitle(e.target.value))
        this._descriptionField.addEventListener('input', (e) => this.setDescription(e.target.value))
        this._submitButton.addEventListener('click', () => this.addToList())

        const storageList = localStorage.getItem('todo-list')

        if (storageList) {
            this._list = JSON.parse(storageList)
        }

        this.renderList()
    }

    setTitle(value) {
        this._title = value
    }

    setDescription(value) {
        this._description = value
    }

    addToList() {

        if (!this._title.trim()) {
            alert('Title is required!')
            return
        }

        if (!this._description.trim()) {
            alert('Description is required!')
            return
        }

        if(!this.toDoList.length) this._todoList.innerHTML = ''

        const newItem = {
            id: Date.now(),
            title: this._title,
            description: this._description,
            completed: false,
            createdAt: new Date()
        }

        this._list.push(newItem)

        this.createItemElement(newItem)

        this.setFilterCount()

        this.saveTodoList()

        this.setTitle()
        this.setDescription()
        this._titleField.value = ''
        this._descriptionField.value = ''

    }

    renderList() {

        this._todoList.innerHTML = ''

        if(this.toDoList.length){
            this.toDoList.forEach(item => this.createItemElement(item))

        }else{
            this._todoList.innerHTML = `<img src="assets/images/not-result.jpg" class="w-100" role="presentation"/>`
        }

        this.saveTodoList()

        this.setFilterCount()

    }

    createItemElement(item) {
        this._todoList.innerHTML =
            `<div class="app-todo-list__item d-flex flex-space-between ${item.completed ? 'checked' : ''}">
            
                <div class="app-todo-list__item-content pr-3 flex-100">
                
                    <h2 class="app-todo-list__item-title mt-0 mb-2">${item.title}</h2>
                    
                    <p class="app-todo-list__item-description mt-0 mb-1">${item.description}</p>
                    
                    <time class="app-todo-list__item-datetime" datetime="${item.createdAt}">${this.getDateFormat(item)}</time>
                    
                </div>
                
                <div class="app-todo-list__item-actions">
                    <input type="checkbox" class="checkbox" ${item.completed ? 'checked' : ''} onchange="todo.toggleChecked(this, ${item.id})"/>
                    
                    <span class="app-todo-list__item-delete" onclick="todo.deleteItem(this, ${item.id})">✖</span>
                </div>
                
            </div>` + this._todoList.innerHTML
    }

    toggleChecked(e, id) {
        const item = this._list.find(item => item.id === id)
        item.completed = e.checked
        this.renderList()
    }

    deleteItem(e, id) {
        if(confirm('Are you sure you want to delete this item?')){
            const item = this._list.find(item => item.id === id)
            const index = this._list.indexOf(item)
            this._list.splice(index, 1)
            this.renderList()
        }
    }

    saveTodoList(){
        localStorage.setItem('todo-list', JSON.stringify(this._list))
    }

    setFilter(active) {

        this._filterButtons.forEach(btn => btn.classList.remove('bg-primary'))

        active.classList.add('bg-primary')

        this._filter = active.dataset.key

        this.renderList()

    }

    setFilterCount(){
        this._filterButtons.forEach(btn => {

            const lengthElement = btn.querySelector('span')

            switch ((btn.dataset.key)) {
                case "active":
                    lengthElement.innerText = this._list.filter(item => !item.completed).length
                    break;
                case "completed":
                    lengthElement.innerText = this._list.filter(item => item.completed).length
                    break;
                default:
                    lengthElement.innerText = this._list.length
            }

        })
    }

    getDateFormat(item){
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "Europe/Moscow"
        };
        return new Intl.DateTimeFormat("ru-RU", options).format(new Date(item.createdAt))
    }

    get toDoList() {

        let list = []

        if (this._filter === 'active') {
            list = this._list.filter(item => !item.completed)
        } else if (this._filter === 'completed') {
            list = this._list.filter(item => item.completed)
        } else {
            list = this._list
        }

        return list.sort((a, b) => a.id - b.id)
    }
}

const todo = new ToDoApp()
