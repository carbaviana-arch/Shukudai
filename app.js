/* app.js - versión diagnóstica y corregida para mostrar tareas por día correctamente */

const categoriasContainer = document.getElementById('categorias');
const puntosTotalesEl = document.getElementById('puntosTotales');
const minutosTotalesEl = document.getElementById('minutosTotales');

// Banner para mostrar errores amigables en la UI
function showBanner(msg, type = 'error') {
  let banner = document.getElementById('appBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'appBanner';
    banner.style.position = 'fixed';
    banner.style.left = '10px';
    banner.style.right = '10px';
    banner.style.top = '10px';
    banner.style.zIndex = '9999';
    banner.style.padding = '0.6rem 1rem';
    banner.style.borderRadius = '8px';
    banner.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    banner.style.fontWeight = '600';
    banner.style.textAlign = 'center';
    document.body.appendChild(banner);
  }
  banner.textContent = msg;
  if (type === 'error') {
    banner.style.background = '#ff6b6b';
    banner.style.color = 'white';
  } else {
    banner.style.background = '#06d6a0';
    banner.style.color = 'white';
  }
  // desaparecer después de 6s
  setTimeout(() => { banner && banner.remove(); }, 6000);
}

/* datos y utilidades */
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Día actual corregido (lunes = 0 ... domingo = 6)
let diaActual = diasSemana[(new Date().getDay() + 6) % 7];

let progreso = {};

/* --- Verificaciones iniciales --- */
if (typeof tareas === 'undefined') {
  console.error('ERROR: la variable `tareas` no está definida. Asegúrate de que tasks.js se cargue antes que app.js y que el archivo se llame exactamente "tasks.js".');
  showBanner('ERROR: tasks.js no cargado o variable `tareas` no encontrada. Revisa el orden de scripts.', 'error');
  // Mostrar un fallback visual básico para que la app no quede en blanco
  categoriasContainer.innerHTML = '<p style="color:crimson; padding:1rem">No se encontraron tareas: revisa que <code>tasks.js</code> esté cargado y sin errores.</p>';
  // Paramos la ejecución para evitar más errores
} else {
  console.log('app.js cargado correctamente. `tareas` detectado:', tareas);
  initApp();
}

/* --- Funciones principales --- */
function initApp() {
  try {
    cargarProgreso();
    renderDias();
    console.log('Init completado. Día actual:', diaActual);
  } catch (err) {
    console.error('Error inicializando la app:', err);
    showBanner('Error al inicializar la app. Revisa la consola para más detalles.', 'error');
  }
}

function cargarProgreso() {
  const data = localStorage.getItem('progresoShukudai');
  if (data) {
    try {
      progreso = JSON.parse(data);
      console.log('Progreso cargado desde localStorage:', progreso);
    } catch (e) {
      console.warn('Progreso en localStorage corrupto. Reiniciando progreso.', e);
      progreso = {};
    }
  } else {
    progreso = {};
  }

  // Inicializar días que no existan
  diasSemana.forEach((dia) => {
    if (!progreso[dia]) {
      progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };
    }
  });
}

function guardarProgreso() {
  try {
    localStorage.setItem('progresoShukudai', JSON.stringify(progreso));
    //console.log('Progreso guardado.');
  } catch (e) {
    console.error('Error guardando progreso en localStorage:', e);
    showBanner('No se pudo guardar progreso en el navegador.', 'error');
  }
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
    if (Array.isArray(tareas[categoria])) {
      tareas[categoria].forEach((t) => (total += Number(t.puntos) || 0));
    }
  }
  return total;
}

/* Renderizado de días y tareas */
function renderDias() {
  categoriasContainer.innerHTML = '';
  console.log('Renderizando días...');

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

    // Renderizar tareas dentro del contenedor del día
    try {
      renderTareas(dayContainer, dia);
    } catch (err) {
      console.error(`Error renderizando tareas para ${dia}:`, err);
      const errMsg = document.createElement('p');
      errMsg.style.color = 'crimson';
      errMsg.textContent = `No se pudieron cargar las tareas para ${dia}. Revisa la consola.`;
      dayContainer.appendChild(errMsg);
    }

    details.appendChild(dayContainer);
    categoriasContainer.appendChild(details);
  });

  actualizarMarcador();
  console.log('Renderizado de días completado.');
}

function renderTareas(container, dia) {
  // comprobación defensiva
  if (typeof tareas === 'undefined') {
    throw new Error('Variable tareas no encontrada al renderizar tareas.');
  }
  // Recorrer categorías
  for (let categoria in tareas) {
    const items = tareas[categoria];
    if (!Array.isArray(items)) continue; // defensivo

    const catDiv = document.createElement('div');
    catDiv.className = 'category';

    const title = document.createElement('h2');
    title.textContent = categoria;
    catDiv.appendChild(title);

    // Cada tarea: crear elemento con ID único que incluya el día
    items.forEach((tarea, i) => {
      const id = `${dia}-${categoria}-${i}`; // <- ID único por día
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

      // Restaurar estado guardado (ahora por ID único)
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

  // Log para depuración
  console.log(`Tareas renderizadas para ${dia}:`, container.querySelectorAll('.task').length);
}

/* Marcar estado y persistir */
function marcarEstado(taskDiv, tarea, estado, dia) {
  const id = taskDiv.dataset.id;
  if (!progreso[dia]) progreso[dia] = { tareas: {}, puntosTotales: 0, minutosTotales: 0 };

  // Revertir puntos si ya estaba cumplida
  if (taskDiv.dataset.estado === 'cumplida') {
    progreso[dia].puntosTotales = Math.max(0, (progreso[dia].puntosTotales || 0) - (Number(tarea.puntos) || 0));
    progreso[dia].minutosTotales = Math.max(0, (progreso[dia].minutosTotales || 0) - (Number(tarea.puntos) || 0));
  }

  if (estado === 'cumplida') {
    taskDiv.classList.add('completed');
    taskDiv.classList.remove('failed');
    taskDiv.dataset.estado = 'cumplida';
    progreso[dia].puntosTotales = (progreso[dia].puntosTotales || 0) + (Number(tarea.puntos) || 0);
    progreso[dia].minutosTotales = (progreso[dia].minutosTotales || 0) + (Number(tarea.puntos) || 0);
  } else if (estado === 'noCumplida') {
    taskDiv.classList.remove('completed');
    taskDiv.classList.add('failed');
    taskDiv.dataset.estado = 'noCumplida';
  } else {
    taskDiv.classList.remove('completed', 'failed');
    delete taskDiv.dataset.estado;
  }

  // Guardar estado individual usando el id único
  progreso[dia].tareas[id] = { estado: taskDiv.dataset.estado };
  guardarProgreso();

  // Refrescar la vista (mantiene el día abierto)
  renderDias();
}

/* Marcador */
function actualizarMarcador() {
  const totalSemana = calcularTotalSemanal();
  puntosTotalesEl.textContent = totalSemana;
  minutosTotalesEl.textContent = totalSemana;
}

/* Fin del archivo */
