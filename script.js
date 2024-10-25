document.addEventListener('DOMContentLoaded', () => {
    const listNameInput = document.getElementById('listNameInput');
    const createListBtn = document.getElementById('createListBtn');
    const listSelect = document.getElementById('listSelect');
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const errorMsg = document.getElementById('errorMsg');
    const taskCounter = document.getElementById('taskCounter');
    const taskSection = document.getElementById('taskSection');
    const showAllBtn = document.getElementById('showAllBtn');
    const showActiveBtn = document.getElementById('showActiveBtn');
    const showCompletedBtn = document.getElementById('showCompletedBtn');

    let lists = JSON.parse(localStorage.getItem('lists')) || {};
    let currentList = null;

    const saveLists = () => {
        localStorage.setItem('lists', JSON.stringify(lists));
    };

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        if (!currentList) return;
    
        let activeCount = 0;
        lists[currentList].forEach((task, index) => {
            if (filter === 'active' && task.done) return;
            if (filter === 'completed' && !task.done) return;
    
            const li = document.createElement('li');
            
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.classList.toggle('done', task.done);
    
            const doneBtn = document.createElement('button');
            doneBtn.textContent = task.done ? 'Undo' : 'Done';
            doneBtn.addEventListener('click', () => toggleTask(index));
    
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => removeTask(index));
    
            const btnContainer = document.createElement('div');
            btnContainer.appendChild(doneBtn);
            btnContainer.appendChild(deleteBtn);
    
            li.appendChild(taskText);
            li.appendChild(btnContainer);
    
            taskList.appendChild(li);
    
            if (!task.done) activeCount++;
        });
    
        taskCounter.innerText = `${activeCount} tasks left`;
    };
    

    const addTask = () => {
        if (!currentList) return;
        const taskText = taskInput.value.trim();
        if (taskText === '' || taskText.length < 3) {
            errorMsg.innerText = 'Task must be at least 3 characters long.';
            taskInput.classList.add('error');
            return;
        }

        lists[currentList].push({ text: taskText, done: false });
        taskInput.value = '';
        taskInput.classList.remove('error');
        errorMsg.innerText = '';
        saveLists();
        renderTasks();
    };

    const toggleTask = (index) => {
        lists[currentList][index].done = !lists[currentList][index].done;
        saveLists();
        renderTasks();
    };

    const removeTask = (index) => {
        lists[currentList].splice(index, 1);
        saveLists();
        renderTasks();
    };

    const createList = () => {
        const listName = listNameInput.value.trim();
        if (listName === '' || lists[listName]) {
            alert('List name cannot be blank or already exist.');
            return;
        }

        lists[listName] = [];
        listNameInput.value = '';
        saveLists();
        updateListSelect();
    };

    const updateListSelect = () => {
        listSelect.innerHTML = `<option value="" disabled selected>Select a list</option>`;
        Object.keys(lists).forEach(list => {
            const option = document.createElement('option');
            option.value = list;
            option.textContent = list;
            listSelect.appendChild(option);
        });
    };

    listSelect.addEventListener('change', () => {
        currentList = listSelect.value;
        taskSection.style.display = 'block';
        renderTasks();
    });

    addTaskBtn.addEventListener('click', addTask);
    createListBtn.addEventListener('click', createList);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });

    showAllBtn.addEventListener('click', () => renderTasks('all'));
    showActiveBtn.addEventListener('click', () => renderTasks('active'));
    showCompletedBtn.addEventListener('click', () => renderTasks('completed'));

    updateListSelect();
});
