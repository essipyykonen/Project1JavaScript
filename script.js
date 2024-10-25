// Wait for the DOM to load before running the script
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

    // Initialize lists object from localStorage or create a new empty object
    let lists = JSON.parse(localStorage.getItem('lists')) || {};
    let currentList = null; // Currently selected list

    // Save lists data to localStorage
    const saveLists = () => {
        localStorage.setItem('lists', JSON.stringify(lists));
    };

    // Render tasks based on the current filter (all, active, completed)
    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = ''; // Clear existing tasks in the DOM
        if (!currentList) return; // Exit if no list is selected
    
        let activeCount = 0; // Track number of active (undone) tasks
        lists[currentList].forEach((task, index) => {
            if (filter === 'active' && task.done) return;
            if (filter === 'completed' && !task.done) return;
    
            // Create task list item with text and buttons
            const li = document.createElement('li');
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.classList.toggle('done', task.done);
    
            // Create 'Done/Undo' button
            const doneBtn = document.createElement('button');
            doneBtn.textContent = task.done ? 'Undo' : 'Done';
            doneBtn.addEventListener('click', () => toggleTask(index));
    
            // Create 'Delete' button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => removeTask(index));
    
            // Add buttons to a container for easier styling
            const btnContainer = document.createElement('div');
            btnContainer.appendChild(doneBtn);
            btnContainer.appendChild(deleteBtn);
    
            // Add task text and buttons to the task item
            li.appendChild(taskText);
            li.appendChild(btnContainer);
            taskList.appendChild(li);
    
            if (!task.done) activeCount++; // Increment count if task is active
        });
    
        taskCounter.innerText = `${activeCount} tasks left`; // Update task counter
    };

    // Add a new task to the current list
    const addTask = () => {
        if (!currentList) return;
        const taskText = taskInput.value.trim();
        // Validate input length
        if (taskText === '' || taskText.length < 3) {
            errorMsg.innerText = 'Task must be at least 3 characters long.';
            taskInput.classList.add('error'); // Highlight input with error style
            return;
        }

        // Add the new task to the list and reset the input field
        lists[currentList].push({ text: taskText, done: false });
        taskInput.value = '';
        taskInput.classList.remove('error');
        errorMsg.innerText = '';
        saveLists();
        renderTasks();
    };

    // Toggle the done status of a task
    const toggleTask = (index) => {
        lists[currentList][index].done = !lists[currentList][index].done;
        saveLists();
        renderTasks();
    };

    // Remove a task from the list
    const removeTask = (index) => {
        lists[currentList].splice(index, 1);
        saveLists();
        renderTasks();
    };

    // Create a new list and update the dropdown menu
    const createList = () => {
        const listName = listNameInput.value.trim();
        // Check for valid list name
        if (listName === '' || lists[listName]) {
            alert('List name cannot be blank or already exist.');
            return;
        }

        lists[listName] = [];
        listNameInput.value = '';
        saveLists();
        updateListSelect();
    };

    // Update the dropdown menu to show available lists
    const updateListSelect = () => {
        listSelect.innerHTML = `<option value="" disabled selected>Select a list</option>`;
        Object.keys(lists).forEach(list => {
            const option = document.createElement('option');
            option.value = list;
            option.textContent = list;
            listSelect.appendChild(option);
        });
    };

    // Event listener for list selection to display tasks in the selected list
    listSelect.addEventListener('change', () => {
        currentList = listSelect.value;
        taskSection.style.display = 'block';
        renderTasks();
    });

    // Event listeners for task and list creation, as well as filter buttons
    addTaskBtn.addEventListener('click', addTask);
    createListBtn.addEventListener('click', createList);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Task filter buttons to show all, active, or completed tasks
    showAllBtn.addEventListener('click', () => renderTasks('all'));
    showActiveBtn.addEventListener('click', () => renderTasks('active'));
    showCompletedBtn.addEventListener('click', () => renderTasks('completed'));

    updateListSelect();
});
