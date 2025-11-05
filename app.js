const categoriasContainer = document.getElementById('categorias');
const puntosTotalesEl = document.getElementById('puntosTotales');
const minutosTotalesEl = document.getElementById('minutosTotales');

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// ✅ Día actual corregido: lunes = 0 ... domingo = 6
let diaActual = diasSemana[(new Date().getDay() + 6) % 7];

let progreso = {};

// Cargar progreso guardado
function cargarProgreso() {
  const data = localStorage.getItem('progresoShukudai');
  if (data) progreso = JSON.parse(data);
  else progreso = {};

  diasSemana.forEach((dia) => {
    if (!progreso[dia]) {
      progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };
    }
  });
}

// Guardar progreso
function guardarProgreso() {
  localStorage.setItem('progresoShukudai', JSON.stringify(progreso));
}

// Calcular total semanal
function calcularTotalSemanal() {
  let total = 0;
  diasSemana.forEach((dia) => {
    total += progreso[dia].puntosTotales;
  });
  return total;
}

// Renderizar los días de la semana con su progreso
const tareas = {
  "Prueba": [
    { nombre: "Tarea de ejemplo", puntos: 5 },
    { nombre: "Otra tarea", puntos: 3 }
  ]
};

function renderDias() {
  categoriasContainer.innerHTML = '';

  diasSemana.forEach((dia) => {
    const details = document.createElement('details');
    details.className = 'dia';
    if (dia === diaActual) details.setAttribute('open', 'true');

    const summary = document.createElement('summary');
    const progresoDia = progreso[dia]?.puntosTotales || 0;
    const totalDia = calcularTotalDia();
    summary.innerHTML = `${dia} — <small>${progresoDia}/${totalDia} pts</small>`;
    details.appendChild(summary);

    const dayContainer = document.createElement('div');
    dayContainer.className = 'dayContainer';
    dayContainer.dataset.dia = dia;

    renderTareas(dayContainer, dia);

    details.appendChild(dayContainer);
    categoriasContainer.appendChild(details);
  });

  actualizarMarcador();
}

// Calcular total posible de un día
function calcularTotalDia() {
  let total = 0;
  for (let categoria in tareas) {
    tareas[categoria].forEach((t) => (total += t.puntos));
  }
  return total;
}

// Renderizar tareas dentro de cada día
function renderTareas(container, dia) {
  for (let categoria in tareas) {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';

    const title = document.createElement('h2');
    title.textContent = categoria;
    catDiv.appendChild(title);

    tareas[categoria].forEach((tarea, i) => {
      const id = `${categoria}-${i}`;
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';
      taskDiv.dataset.id = id;

      const span = document.createElement('span');
      span.textContent = `${tarea.nombre} (+${tarea.puntos} pts)`;
      taskDiv.appendChild(span);

      // Botones de estado
      const btnCumplida = document.createElement('button');
      btnCumplida.textContent = '✅';
      btnCumplida.onclick = () => marcarEstado(taskDiv, tarea, 'cumplida', dia);
      taskDiv.appendChild(btnCumplida);

      const btnNoCumplida = document.createElement('button');
      btnNoCumplida.textContent = '❌';
      btnNoCumplida.onclick = () => marcarEstado(taskDiv, tarea, 'noCumplida', dia);
      taskDiv.appendChild(btnNoCumplida);

      // Restaurar estado guardado
      const estado = progreso[dia]?.tareas?.[id]?.estado;
      if (estado === 'cumplida') {
        taskDiv.classList.add('completed');
        taskDiv.dataset.estado = 'cumplida';
      } else if (estado === 'noCumplida') {
        taskDiv.classList.add('failed');
        taskDiv.dataset.estado = 'noCumplida';
      }

      catDiv.appendChild(taskDiv);
    });

    container.appendChild(catDiv);
  }
}

// Cambiar estado de una tarea
function marcarEstado(taskDiv, tarea, estado, dia) {
  const id = taskDiv.dataset.id;
  if (!progreso[dia]) progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };

  // Revertir si estaba marcada cumplida
  if (taskDiv.dataset.estado === 'cumplida') {
    progreso[dia].puntosTotales -= tarea.puntos;
    progreso[dia].minutosTotales -= tarea.puntos;
  }

  if (estado === 'cumplida') {
    taskDiv.classList.add('completed');
    taskDiv.classList.remove('failed');
    taskDiv.dataset.estado = 'cumplida';
    progreso[dia].puntosTotales += tarea.puntos;
    progreso[dia].minutosTotales += tarea.puntos;
  } else if (estado === 'noCumplida') {
    taskDiv.classList.remove('completed');
    taskDiv.classList.add('failed');
    taskDiv.dataset.estado = 'noCumplida';
  } else {
    taskDiv.classList.remove('completed', 'failed');
    delete taskDiv.dataset.estado;
  }

  progreso[dia].tareas[id] = { estado: taskDiv.dataset.estado };
  guardarProgreso();
  renderDias();
}

// Actualizar marcador general
function actualizarMarcador() {
  const totalSemana = calcularTotalSemanal();
  puntosTotalesEl.textContent = totalSemana;
  minutosTotalesEl.textContent = totalSemana; // 1 punto = 1 minuto
}

// Iniciar app
cargarProgreso();
renderDias();
