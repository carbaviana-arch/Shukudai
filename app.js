/* =======================================================
   SHUKUDAI 2.3 - Gráficos, medallas y premio semanal
   ======================================================= */

/* ----------------------
   Datos base de tareas
   ---------------------- */
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

/* ----------------------
   Elementos DOM
   ---------------------- */
const categoriasContainer = document.getElementById('categorias');
const puntosTotalesEl = document.getElementById('puntosTotales');
const minutosTotalesEl = document.getElementById('minutosTotales');
const btnPremioDiario = document.getElementById('btnPremioDiario');
const btnPremioSemanal = document.getElementById('btnPremioSemanal');
const btnReset = document.getElementById('btnReset');

const canvasSemanal = document.getElementById('graficoSemanal');
const canvasMensual = document.getElementById('graficoMensual');
const medallaEl = document.getElementById('medalla');

/* ----------------------
   Días y progreso
   ---------------------- */
const diasSemana = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
let diaActual = diasSemana[(new Date().getDay() + 6) % 7];
let progreso = {}; // estructura por día
let progresoDiario = {}; // historial simple por fecha: { '2025-11-06': 12 }

/* ----------------------
   Almacenamiento
   ---------------------- */
function cargarProgreso() {
  const data = localStorage.getItem('progresoShukudai');
  progreso = data ? JSON.parse(data) : {};
  // compatibilidad: si no existen días, inicializar
  diasSemana.forEach(d => {
    if (!progreso[d]) progreso[d] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };
  });

  const pd = localStorage.getItem('progresoDiario');
  progresoDiario = pd ? JSON.parse(pd) : {};
}

function guardarProgreso() {
  localStorage.setItem('progresoShukudai', JSON.stringify(progreso));
  // actualizar registro diario con el total del día actual
  const hoy = new Date().toISOString().split('T')[0];
  progresoDiario[hoy] = progreso[diaActual]?.puntosTotales || 0;
  // mantener solo últimos 60 entradas por seguridad
  const keys = Object.keys(progresoDiario).sort();
  if (keys.length > 120) {
    const slice = keys.slice(keys.length - 120);
    const newObj = {};
    slice.forEach(k => newObj[k] = progresoDiario[k]);
    progresoDiario = newObj;
  }
  localStorage.setItem('progresoDiario', JSON.stringify(progresoDiario));
}

/* ----------------------
   Cálculos
   ---------------------- */
function calcularTotalSemanal() {
  return diasSemana.reduce((t, d) => t + (progreso[d]?.puntosTotales || 0), 0);
}
function calcularTotalDia() {
  return Object.values(tareas).flat().reduce((s, t) => s + t.puntos, 0);
}

/* ----------------------
   Renderizado de días y tareas
   ---------------------- */
function renderDias() {
  // conservar estado abiertos
  const abiertos = Array.from(document.querySelectorAll('.dia[open]')).map(d => d.querySelector('summary').textContent.split(' —')[0]);
  categoriasContainer.innerHTML = '';

  diasSemana.forEach(dia => {
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

    // Botón reiniciar sólo para ese día
    const btnResetDia = document.createElement('button');
    btnResetDia.textContent = `🔄 Reiniciar ${dia}`;
    btnResetDia.className = 'btnResetDia';
    btnResetDia.onclick = () => reiniciarDia(dia);
    details.appendChild(btnResetDia);

    categoriasContainer.appendChild(details);
  });

  actualizarMarcador();
  actualizarNivel();
  renderGraficos(); // actualizar gráficos tras render
}

/* ----------------------
   Render de tareas (alineado botones)
   ---------------------- */
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

      const btnGroup = document.createElement('div');
      btnGroup.className = 'task-buttons';

      const btnCumplida = document.createElement('button');
      btnCumplida.title = 'Marcar cumplida';
      btnCumplida.textContent = '✅';
      btnCumplida.onclick = () => marcarEstado(taskDiv, tarea, 'cumplida', dia);

      const btnNoCumplida = document.createElement('button');
      btnNoCumplida.title = 'Marcar no cumplida';
      btnNoCumplida.textContent = '❌';
      btnNoCumplida.onclick = () => marcarEstado(taskDiv, tarea, 'noCumplida', dia);

      btnGroup.appendChild(btnCumplida);
      btnGroup.appendChild(btnNoCumplida);

      const estado = progreso[dia]?.tareas?.[id]?.estado;
      if (estado === 'cumplida') taskDiv.classList.add('completed');
      else if (estado === 'noCumplida') taskDiv.classList.add('failed');

      if (estado) {
        const btnDeshacer = document.createElement('button');
        btnDeshacer.title = 'Deshacer';
        btnDeshacer.textContent = '↩️';
        btnDeshacer.onclick = () => {
          // revertir puntos si fue cumplida
          if (progreso[dia].tareas[id]?.estado === 'cumplida') {
            progreso[dia].puntosTotales -= tarea.puntos;
            progreso[dia].minutosTotales -= tarea.puntos;
          }
          delete progreso[dia].tareas[id];
          guardarProgreso();
          renderDias();
        };
        btnGroup.appendChild(btnDeshacer);
      }

      taskDiv.appendChild(span);
      taskDiv.appendChild(btnGroup);
      catDiv.appendChild(taskDiv);
    });

    container.appendChild(catDiv);
  }
}

/* ----------------------
   Reinicio por día
   ---------------------- */
function reiniciarDia(dia) {
  if (!confirm(`¿Seguro que quieres reiniciar las tareas de ${dia}?`)) return;
  progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };
  guardarProgreso();
  renderDias();
  alert(`🔄 ${dia} ha sido reiniciado.`);
}

/* ----------------------
   Marcar estado y lógica de puntos
   ---------------------- */
function marcarEstado(taskDiv, tarea, estado, dia) {
  const id = taskDiv.dataset.id;
  if (!progreso[dia]) progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };

  // Si estaba cumplida, restar puntos antes de nueva asignación
  if (progreso[dia].tareas[id]?.estado === 'cumplida') {
    progreso[dia].puntosTotales -= tarea.puntos;
    progreso[dia].minutosTotales -= tarea.puntos;
  }

  if (estado === 'cumplida') {
    progreso[dia].tareas[id] = { estado: 'cumplida' };
    progreso[dia].puntosTotales += tarea.puntos;
    progreso[dia].minutosTotales += tarea.puntos;
  } else if (estado === 'noCumplida') {
    progreso[dia].tareas[id] = { estado: 'noCumplida' };
  } else {
    // neutro - eliminar estado
    delete progreso[dia].tareas[id];
  }

  guardarProgreso();
  renderDias();
}

/* ----------*
