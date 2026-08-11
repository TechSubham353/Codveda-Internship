// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

// Load tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display tasks when page loads
renderTasks();


// Add Task
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});


function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


// Display Tasks
function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    tasks.forEach(function (task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">${escapeHTML(task.text)}</span>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateTaskCount();
}


// Complete / Undo Task
function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


// Edit Task
function editTask(id) {

    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    const updatedText = prompt("Edit your task:", task.text);

    if (updatedText === null) {
        return;
    }

    const newText = updatedText.trim();

    if (newText === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = newText;

    saveTasks();
    renderTasks();
}


// Delete Task
function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}


// Update Task Count
function updateTaskCount() {

    const total = tasks.length;

    if (total === 1) {
        taskCount.textContent = "1 task";
    } else {
        taskCount.textContent = `${total} tasks`;
    }
}


// Save Tasks to Local Storage
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// Protect against HTML injection
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}