/* =======================================================
   SHUKUDAI 2.2 - Recompensas, niveles y correcciones
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
const btnPremioDiario = document.getElementById('btnPremioDiario');
const btnReset = document.getElementById('btnReset');

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

// 📊 CÁLCULOS
function calcularTotalSemanal() {
  return diasSemana.reduce((total, dia) => total + (progreso[dia]?.puntosTotales || 0), 0);
}

function calcularTotalDia() {
  return Object.values(tareas).flat().reduce((sum, t) => sum + t.puntos, 0);
}

// 🧩 RENDERIZADO DE DÍAS Y TAREAS
function renderDias() {
  const abiertos = Array.from(document.querySelectorAll('.dia[open]')).map(d => d.querySelector('summary').textContent.split(' —')[0]);
  categoriasContainer.innerHTML = '';

  diasSemana.forEach((dia) => {
    const details = document.createElement('details');
    details.className = 'dia';
    if (abiertos.includes(dia) || dia === diaActual) details.setAttribute('open', 'true');

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
  actualizarNivel();
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

      // 🟢 Botón Deshacer
      if (estado) {
        const btnDeshacer = document.createElement('button');
        btnDeshacer.textContent = '↩️';
        btnDeshacer.onclick = () => marcarEstado(taskDiv, tarea, 'neutro', dia);
        taskDiv.appendChild(btnDeshacer);
      }

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

// 🟡 PREMIO DIARIO (+10 puntos)
btnPremioDiario.addEventListener('click', () => {
  const hoy = new Date().toISOString().split('T')[0];
  if (localStorage.getItem(`premio-${hoy}`)) {
    alert('Ya has usado el Premio Diario hoy 🏅');
    return;
  }
  const dia = diaActual;
  progreso[dia].puntosTotales += 10;
  progreso[dia].minutosTotales += 10;
  guardarProgreso();
  renderDias();
  localStorage.setItem(`premio-${hoy}`, 'true');
  alert('🎉 Premio Diario otorgado (+10 pts)');
});

// 🔴 BOTÓN DE REINICIO
btnReset.addEventListener('click', () => {
  if (confirm('¿Seguro que quieres reiniciar el marcador semanal?')) {
    diasSemana.forEach((dia) => {
      progreso[dia].puntosTotales = 0;
      progreso[dia].minutosTotales = 0;
    });
    guardarProgreso();
    renderDias();
    alert('❌ Marcador reiniciado.');
  }
});

// 🆙 SISTEMA DE NIVEL
function calcularNivel(puntos) {
  return Math.floor(puntos / 150) + 1;
}

function actualizarNivel() {
  const total = calcularTotalSemanal();
  const nivel = calcularNivel(total);
  const puntosEnNivel = total % 150;
  const progresoNivel = Math.round((puntosEnNivel / 150) * 100);
  document.getElementById('nivelActual').textContent = nivel;
  document.getElementById('xpFill').style.width = `${progresoNivel}%`;
  document.getElementById('xpTexto').textContent = `${puntosEnNivel} / 150 pts`;
}

// 🚀 INICIO
cargarProgreso();
renderDias();
