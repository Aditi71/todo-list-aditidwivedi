const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const addBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks to the UI
function renderTasks() {
  taskList.innerHTML = '';

  // Sort tasks by due date (earliest first), empty dates go to the bottom
  tasks.sort((a, b) => {
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    // Display task text with due date (if present)
    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.dueDate) {
      span.textContent += ` (Due: ${task.dueDate})`;
    }

    // Toggle completion on click
    span.addEventListener('click', () => {
      tasks[idx].completed = !tasks[idx].completed;
      saveTasks();
      renderTasks();
    });

    // Delete button
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.className = 'delete-btn';
    btn.addEventListener('click', () => {
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks();
    });

    li.append(span, btn);
    taskList.appendChild(li);
  });
}

// Add new task
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  const due = dueDateInput.value;

  if (text) {
    tasks.push({
      text: text,
      dueDate: due,
      completed: false
    });

    // Clear inputs
    taskInput.value = '';
    dueDateInput.value = '';

    saveTasks();
    renderTasks();
  }
});

// Initial render on page load
window.addEventListener('load', renderTasks);