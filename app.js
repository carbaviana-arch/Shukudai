const categoriasContainer = document.getElementById('categorias');

function renderTareas() {
  categoriasContainer.innerHTML = '';
  for (let categoria in tareas) {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';

    const title = document.createElement('h2');
    title.textContent = categoria;
    catDiv.appendChild(title);

    tareas[categoria].forEach((tarea, i) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';

      const span = document.createElement('span');
      span.textContent = `${tarea.nombre} (+${tarea.puntos} pts)`;
      taskDiv.appendChild(span);

      const btn = document.createElement('button');
      btn.textContent = '✔️';
      btn.onclick = () => marcarCompletada(taskDiv);
      taskDiv.appendChild(btn);

      catDiv.appendChild(taskDiv);
    });

    categoriasContainer.appendChild(catDiv);
  }
}

function marcarCompletada(taskDiv) {
  taskDiv.classList.toggle('completed');
}

renderTareas();