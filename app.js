/* =======================================================
   SHUKUDAI 2.1 - Versión con tareas integradas en app.js
   ======================================================= */

// ===============================
// 📋 TAREAS BASE
// ===============================
const tareas = {
  "Aseo e higiene personal": [
    { nombre: "Lavarse bien los dientes", puntos: 2 },
    { nombre: "Ducharse bien", puntos: 3 },
    { nombre: "Usar desodorante", puntos: 1 }
  ],
  "Académico": [
    { nombre: "Hacer deberes", puntos: 5 },
    { nombre: "Estudiar para controles", puntos: 4 }
  ],
  "Hogar": [
    { nombre: "Ordenar habitación", puntos: 3 },
    { nombre: "Limpiar habitación", puntos: 3 },
    { nombre: "Sacar lavavajillas", puntos: 2 },
    { nombre: "Limpiar baño", puntos: 3 }
  ]
};

// ===============================
// ⚙️ ELEMENTOS BASE DEL DOM
// ===============================
const categoriasContainer = document.getElementById('categorias');
const puntosTotalesEl = document.getElementById('puntosTotales');
const minutosTotalesEl = document.getElementById('minutosTotales');

// ===============================
// 📅 CONFIGURACIÓN DE DÍAS
// ===============================
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Día actual corregido (lunes = 0 ... domingo = 6)
let diaActual = diasSemana[(new Date().getDay() + 6) % 7];

let progreso = {};

// ===============================
// 💾 GESTIÓN DE PROGRESO
// ===============================
function cargarProgreso() {
  const data = localStorage.getItem('progresoShukudai');
  if (data) {
    try {
      progreso = JSON.parse(data);
    } catch {
      progreso = {};
    }
  } else {
    progreso = {};
  }

  diasSemana.forEach((dia) => {
    if (!progreso[dia]) {
      progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };
    }
  });
}

function guardarProgreso() {
  localStorage.setItem('progresoShukudai', JSON.stringify(progreso));
}

function calcularTotalSemanal() {
  let total = 0;
  diasSemana.forEach((dia) => {
    total += progreso[dia].puntosTotales || 0;
  });
  return total;
}

function calcularTotalDia() {
  let total = 0;
  for (let categoria in tareas) {
    tareas[categoria].forEach((t) => (total += t.puntos));
  }
  return total;
}

// ===============================
// 🧩 RENDERIZADO DE DÍAS Y TAREAS
// ===============================
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

// ===============================
// 🧠 LÓGICA DE ESTADO Y MARCADORES
// ===============================
function marcarEstado(taskDiv, tarea, estado, dia) {
  const id = taskDiv.dataset.id;
  if (!progreso[dia]) progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };

  // Revertir si ya estaba cumplida
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
  minutosTotalesEl.textContent = totalSemana; // 1 punto = 1 minuto
}

// ===============================
// 🚀 INICIO DE LA APLICACIÓN
// ===============================
cargarProgreso();
renderDias();
