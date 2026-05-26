const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedButton = document.getElementById('clear-completed');
const STORAGE_KEY = 'todo-list-items';

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const saveTodos = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const updateStats = () => {
  const remaining = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} remaining`;
};

const createTodoItem = (todo) => {
  const item = document.createElement('li');
  item.className = 'todo-item';
  item.dataset.id = todo.id;

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;

  const text = document.createElement('span');
  text.className = `todo-text${todo.completed ? ' completed' : ''}`;
  text.textContent = todo.text;

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;
    saveTodos();
    renderTodos();
  });

  label.appendChild(checkbox);
  label.appendChild(text);

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => removeTodoItem(todo.id, item));

  actions.appendChild(deleteButton);
  item.appendChild(label);
  item.appendChild(actions);

  return item;
};

const renderTodos = () => {
  list.innerHTML = '';

  if (todos.length === 0) {
    const placeholder = document.createElement('li');
    placeholder.className = 'todo-item placeholder';
    placeholder.textContent = 'No tasks yet — add one to get started.';
    list.appendChild(placeholder);
    updateStats();
    return;
  }

  todos.forEach((todo) => list.appendChild(createTodoItem(todo)));
  updateStats();
};

const removeTodoItem = (id, itemElement) => {
  itemElement.classList.add('removing');
  itemElement.addEventListener('animationend', () => {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
  }, { once: true });
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  todos.unshift(newTodo);
  saveTodos();
  renderTodos();
  input.value = '';
  input.focus();
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

renderTodos();
