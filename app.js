/* =======================================================
   SHUKUDAI 2.1.3 - Con tareas integradas y botones extra
   ======================================================= */

// 📋 TAREAS BASE
const tareas = {
  "Aseo e higiene personal": [
    { nombre: "Lavarse bien los dientes", puntos: 2 },
    { nombre: "Ducharse bien", puntos: 2 },
    { nombre: "Usar desodorante", puntos: 1 }
  ],
  "Académico": [
    { nombre: "Hacer deberes", puntos: 1 },
    { nombre: "Estudiar para controles", puntos: 2 },
    { nombre: "Leer 15 Min", puntos: 5 },
    { nombre: "Repaso Contenidos", puntos: 3 }
  ],
  "Hogar": [
    { nombre: "Ordenar habitación", puntos: 1 },
    { nombre: "Limpiar habitación", puntos: 2 },
    { nombre: "Sacar lavavajillas", puntos: 1 },
    { nombre: "Limpiar baño", puntos: 2 }
  ],
  "General": [
    { nombre: "Lenguaje", puntos: 1 },
    { nombre: "Buena Actitud", puntos: 1 },
    { nombre: "Colabora en Labores Hogar", puntos: 1 }
  ]
};

// ⚙️ ELEMENTOS DEL DOM
const categoriasContainer = document.getElementById('categorias');
const puntosTotalesEl = document.getElementById('puntosTotales');
const minutosTotalesEl = document.getElementById('minutosTotales');

// 📅 CONFIGURACIÓN DE DÍAS
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
let diaActual = diasSemana[(new Date().getDay() + 6) % 7];
let progreso = {};

// 💾 GESTIÓN DE PROGRESO
function cargarProgreso() {
  const data = localStorage.getItem('progresoShukudai');
  progreso = data ? JSON.parse(data) : {};
  diasSemana.forEach((dia) => {
    if (!progreso[dia]) progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };
  });
}

function guardarProgreso() {
  localStorage.setItem('progresoShukudai', JSON.stringify(progreso));
}

function calcularTotalSemanal() {
  return diasSemana.reduce((total, dia) => total + (progreso[dia]?.puntosTotales || 0), 0);
}

function calcularTotalDia() {
  return Object.values(tareas).flat().reduce((sum, t) => sum + t.puntos, 0);
}

// 🧩 RENDERIZADO
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

function renderTareas(container, dia) {
  for (let categoria in tareas) {
    const catDiv = document.createElement('div');
    catDiv.className = 'category';

    const title = document.createElement('h2');
    title.textContent = categoria;
    catDiv.appendChild(title);

    tareas[categoria].forEach((tarea, i) => {
      const id = `${dia}-${categoria}-${i}`;
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';
      taskDiv.dataset.id = id;

      const span = document.createElement('span');
      span.textContent = `${tarea.nombre} (+${tarea.puntos} pts)`;
      taskDiv.appendChild(span);

      const btnCumplida = document.createElement('button');
      btnCumplida.textContent = '✅';
      btnCumplida.onclick = () => marcarEstado(taskDiv, tarea, 'cumplida', dia);
      taskDiv.appendChild(btnCumplida);

      const btnNoCumplida = document.createElement('button');
      btnNoCumplida.textContent = '❌';
      btnNoCumplida.onclick = () => marcarEstado(taskDiv, tarea, 'noCumplida', dia);
      taskDiv.appendChild(btnNoCumplida);

      const estado = progreso[dia]?.tareas?.[id]?.estado;
      if (estado === 'cumplida') taskDiv.classList.add('completed');
      else if (estado === 'noCumplida') taskDiv.classList.add('failed');

      catDiv.appendChild(taskDiv);
    });

    container.appendChild(catDiv);
  }
}

// 🧠 ESTADO Y MARCADOR
function marcarEstado(taskDiv, tarea, estado, dia) {
  const id = taskDiv.dataset.id;
  if (!progreso[dia]) progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };

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

function actualizarMarcador() {
  const totalSemana = calcularTotalSemanal();
  puntosTotalesEl.textContent = totalSemana;
  minutosTotalesEl.textContent = totalSemana;
}

// 🟡 BOTÓN DE RECOMPENSA EXTRA
const btnRecompensa = document.getElementById('btnRecompensa');
const btnReset = document.getElementById('btnReset');

btnRecompensa.addEventListener('click', () => {
  diasSemana.forEach((dia) => {
    progreso[dia].puntosTotales += 15;
    progreso[dia].minutosTotales += 15;
  });
  guardarProgreso();
  renderDias();
  alert('🏅 ¡Recompensa otorgada! +15 puntos por buena conducta o excelente desempeño.');
});

// 🔴 BOTÓN DE REINICIO
btnReset.addEventListener('click', () => {
  if (confirm('¿Seguro que quieres reiniciar el marcador semanal? Esta acción no se puede deshacer.')) {
    diasSemana.forEach((dia) => {
      progreso[dia].puntosTotales = 0;
      progreso[dia].minutosTotales = 0;
    });
    guardarProgreso();
    renderDias();
    alert('❌ Marcador reiniciado por mal comportamiento o control reprobado.');
  }
});

// 🚀 INICIO
cargarProgreso();
renderDias();
