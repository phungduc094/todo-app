(function(){
  const input = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const list = document.getElementById('todo-list');

  function saveTodos(todos){
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function loadTodos(){
    try{
      const raw = JSON.parse(localStorage.getItem('todos')||'[]');
      if(!Array.isArray(raw)) return [];
      return raw.map(item => {
        if(typeof item === 'string') return { text: item, done: false };
        if(item && typeof item === 'object') return { text: String(item.text||''), done: !!item.done };
        return { text: String(item), done: false };
      });
    }catch(e){
      return [];
    }
  }

  function render(){
    const todos = loadTodos();
    list.innerHTML = '';
    if(todos.length===0){
      const el = document.createElement('p');
      el.className = 'muted';
      el.textContent = 'No todos yet — add one above.';
      list.appendChild(el);
      return;
    }

    todos.forEach((t, i) => {
      const li = document.createElement('li');
      li.className = 'todo-item';

      const span = document.createElement('span');
      span.className = 'todo-text' + (t.done ? ' completed' : '');
      span.textContent = t.text;
      span.title = t.done ? 'Mark as not completed' : 'Mark as completed';
      span.addEventListener('click', () => {
        const updated = loadTodos();
        updated[i].done = !updated[i].done;
        saveTodos(updated);
        render();
      });

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = 'Delete';
      del.addEventListener('click', () => {
        const updated = loadTodos();
        updated.splice(i,1);
        saveTodos(updated);
        render();
      });

      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  function addTodo(){
    const val = input.value.trim();
    if(!val) return;
    const todos = loadTodos();
    todos.push({ text: val, done: false });
    saveTodos(todos);
    input.value = '';
    render();
    input.focus();
  }

  addBtn.addEventListener('click', addTodo);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') addTodo(); });

  // theme handling
  function applyTheme(theme){
    if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    const btn = document.getElementById('theme-toggle');
    if(btn) btn.textContent = theme==='dark' ? '☀️' : '🌙';
  }

  function loadTheme(){
    return localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function saveTheme(theme){ localStorage.setItem('theme', theme); }

  document.addEventListener('DOMContentLoaded', ()=>{
    const current = loadTheme();
    applyTheme(current);
    const toggle = document.getElementById('theme-toggle');
    if(toggle){
      toggle.addEventListener('click', ()=>{
        const next = document.documentElement.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
        applyTheme(next);
        saveTheme(next);
      });
    }
  });

  // initial render
  render();
})();
