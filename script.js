let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const statsLabel = document.getElementById('statsLabel');
const filterBtns = document.querySelectorAll('.filter-btn');

// Add Task Event
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = '';
  saveAndRender();
}

function toggleTask(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

function updateStats() {
  const completed = tasks.filter(t => t.completed).length;
  const remaining = tasks.length - completed;
  statsLabel.textContent = `${completed} completed • ${remaining} remaining`;
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
  updateStats();
}

// Filter button logic
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

function render() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <span class="task-text">${task.text}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
    `;

    taskList.appendChild(li);
  });
}

// Initial Render
render();
updateStats();