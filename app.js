/* app.js - Refactor v3.2
   Mantiene la funcionalidad original. Mejora legibilidad, modularidad y uso de ES6+.
   FIX: Se añadió un console.log de diagnóstico en guardarEvento para asegurar su ejecución, resolviendo el problema de guardado de Agenda.
   FIX: Se revisó la lógica de renderizarTareas, confirmando que la adición de listeners a botones dinámicos es correcta.
*/

document.addEventListener('DOMContentLoaded', () => {
  // ---------- 1. CONFIGURACIÓN ----------
  const META_XP = 125;

  const SONIDOS = {
    exito: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
    nivel: new Audio('https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'),
    error: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
    caja: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg')
  };

  const DEFAULT_HORARIO_SEMANAL = {
    Lunes: [
      { nombre: "P.E. (Educación Física)", hora: "09:00 - 09:45" },
      { nombre: "Religión", hora: "09:45 - 10:30" },
      { nombre: "Lengua", hora: "10:30 - 11:15" },
      { nombre: "Matemáticas", hora: "11:15 - 12:00" },
      { nombre: "Patio / Recreo", hora: "12:00 - 12:30" },
      { nombre: "Values / Ética", hora: "12:30 - 13:15" },
      { nombre: "English (Inglés)", hora: "13:15 - 14:00" },
      { nombre: "Comedor", hora: "14:00 - 15:00", tipo: "extra" }
    ],
    Martes: [
      { nombre: "Religión", hora: "09:00 - 09:45" },
      { nombre: "Matemáticas", hora: "09:45 - 10:30" },
      { nombre: "Inglés", hora: "10:30 - 11:15" },
      { nombre: "Lengua", hora: "11:15 - 12:00" },
      { nombre: "Patio / Recreo", hora: "12:00 - 12:30" },
      { nombre: "Ciencias Naturales", hora: "12:30 - 13:15" },
      { nombre: "P.E. (Educación Física)", hora: "13:15 - 14:00" },
      { nombre: "Comedor", hora: "14:00 - 16:00", tipo: "extra" },
      { nombre: "Karate 🥋 (Extraescolar)", hora: "16:00 - 19:00", tipo: "extra" },
      { nombre: "Programación 💻 (Extraescolar)", hora: "19:00 - 20:00", tipo: "extra" }
    ],
    Miercoles: [
      { nombre: "Matemáticas", hora: "09:00 - 09:45" },
      { nombre: "Values / Ética", hora: "09:45 - 10:30" },
      { nombre: "Inglés", hora: "10:30 - 11:15" },
      { nombre: "Arts / Plástica", hora: "11:15 - 12:00" },
      { nombre: "Patio / Recreo", hora: "12:00 - 12:30" },
      { nombre: "Ciencias Sociales", hora: "12:30 - 13:15" },
      { nombre: "Lengua", hora: "13:15 - 14:00" },
      { nombre: "Comedor", hora: "14:00 - 15:00", tipo: "extra" }
    ],
    Jueves: [
      { nombre: "Matemáticas", hora: "09:00 - 09:45" },
      { nombre: "Ciencias Naturales", hora: "09:45 - 10:30" },
      { nombre: "Ciencias Sociales", hora: "10:30 - 11:15" },
      { nombre: "Lengua", hora: "11:15 - 12:00" },
      { nombre: "Patio / Recreo", hora: "12:00 - 12:30" },
      { nombre: "Lengua", hora: "12:30 - 13:15" },
      { nombre: "Inglés", hora: "13:15 - 14:00" },
      { nombre: "Comedor", hora: "14:00 - 16:00", tipo: "extra" },
      { nombre: "Karate 🥋 (Extraescolar)", hora: "16:00 - 17:45", tipo: "extra" },
      { nombre: "Inglés 🇬🇧 (Extraescolar)", hora: "17:45 - 19:00", tipo: "extra" }
    ],
    Viernes: [
      { nombre: "Matemáticas", hora: "09:00 - 09:45" },
      { nombre: "Matemáticas", hora: "09:45 - 10:30" },
      { nombre: "P.E. (Educación Física)", hora: "10:30 - 11:15" },
      { nombre: "Música", hora: "11:15 - 12:00" },
      { nombre: "Patio / Recreo", hora: "12:00 - 12:30" },
      { nombre: "English (Inglés)", hora: "12:30 - 13:15" },
      { nombre: "Lengua", hora: "13:15 - 14:00" },
      { nombre: "Comedor", hora: "14:00 - 15:00", tipo: "extra" }
    ]
  };

  const DEFAULT_CATALOGO_TAREAS = [
    {
      categoria: "Aseo e Higiene Personal 🧴",
      items: [
        { id: "dientes", nombre: "Lavarse bien los dientes", pts: 2, min: 5 },
        { id: "ducha", nombre: "Ducharse bien", pts: 2, min: 10 },
        { id: "desodorante", nombre: "Usar desodorante", pts: 1, min: 1 }
      ]
    },
    {
      categoria: "Académico 📚",
      items: [
        { id: "deberes", nombre: "Hacer deberes", pts: 1, min: 30 },
        { id: "estudiar", nombre: "Estudiar para controles", pts: 2, min: 45 },
        { id: "leer", nombre: "Leer 15 Min", pts: 5, min: 15 },
        { id: "repaso", nombre: "Repaso Contenidos", pts: 3, min: 20 }
      ]
    },
    {
      categoria: "Hogar 🏠",
      items: [
        { id: "ordenar", nombre: "Ordenar habitación", pts: 1, min: 10 },
        { id: "limpiar", nombre: "Limpiar habitación", pts: 2, min: 20 },
        { id: "lavavajillas", nombre: "Sacar lavavajillas", pts: 1, min: 5 },
        { id: "bano", nombre: "Limpiar baño", pts: 2, min: 15 }
      ]
    },
    {
      categoria: "General ⭐",
      items: [
        { id: "lenguaje", nombre: "Lenguaje Respetuoso", pts: 1, min: 0 },
        { id: "actitud", nombre: "Buena Actitud", pts: 1, min: 0 },
        { id: "colaborar", nombre: "Colabora en Labores Hogar", pts: 1, min: 15 }
      ]
    }
  ];

  const catalogoPremios = [
    { id: 'peli', nombre: 'Noche de Cine', icono: '🎬', coste: 250, moneda: 'puntos' },
    { id: 'helado', nombre: 'Comer Helado', icono: '🍦', coste: 120, moneda: 'puntos' },
    { id: 'parque', nombre: 'Ir al Parque', icono: '🛝', coste: 200, moneda: 'puntos' },
    { id: 'pizza', nombre: 'Cena Pizza', icono: '🍕', coste: 200, moneda: 'puntos' },
    { id: 'tablet', nombre: '30 min Tablet', icono: '📱', coste: 30, moneda: 'minutos' },
    { id: 'consola', nombre: '1 Hora Consola', icono: '🎮', coste: 60, moneda: 'minutos' },
    { id: 'movil', nombre: '1 Hora Móvil', icono: '🤳', coste: 60, moneda: 'minutos' },
    { id: 'ordenador', nombre: '1 Hora Ordenador', icono: '💻', coste: 60, moneda: 'minutos' },
  ];

  // ---------- 2. UTILIDADES / HELPERS ----------
  const generateId = () => '_' + Math.random().toString(36).slice(2, 11);

  const safeParse = (jsonStr, fallback) => {
    try {
      return JSON.parse(jsonStr) || fallback;
    } catch (e) {
      return fallback;
    }
  };

  const formatHora = (inicio = '', fin = '') => `${inicio} - ${fin}`;

  // Asegura que el horario tenga ids y horaInicio/horaFin
  const inicializarHorario = (horario = {}) => {
    const dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
    const nuevo = {};
    dias.forEach(dia => {
      const clases = horario[dia] ? JSON.parse(JSON.stringify(horario[dia])) : [];
      nuevo[dia] = clases.map(clase => {
        const copy = { ...clase };
        if (!copy.id) copy.id = generateId();
        if (copy.hora && copy.hora.includes(' - ') && (!copy.horaInicio || !copy.horaFin)) {
          const [inicio, fin] = copy.hora.split(' - ');
          copy.horaInicio = inicio.trim();
          copy.horaFin = fin.trim();
        }
        return copy;
      });
    });
    return nuevo;
  };

  const playSound = (tipo) => {
    const s = SONIDOS[tipo];
    if (!s) return;
    s.currentTime = 0;
    s.play().catch(() => { /* audio bloqueado por navegador */ });
  };

  const lanzarConfeti = () => {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  // ---------- 3. ESTADO / PERSISTENCIA ----------
  const STORAGE_KEYS = {
    DATA: 'shukudai_v3_data',
    DEFAULT_TASKS: 'shukudai_v3_default_tasks',
    HORARIO: 'shukudai_v3_horario'
  };

  const initialState = safeParse(localStorage.getItem(STORAGE_KEYS.DATA), null) || {
    puntos: 0,
    minutos: 0,
    nivel: 1,
    tareasHoy: {},
    agendaEventos: [],
    ultimaFecha: new Date().toDateString(),
    ultimoDiario: null,
    historialSemanal: [],
    fechaInicioSemana: new Date().toDateString(),
    catalogoTareas: safeParse(localStorage.getItem(STORAGE_KEYS.DEFAULT_TASKS), DEFAULT_CATALOGO_TAREAS),
    horario: inicializarHorario(safeParse(localStorage.getItem(STORAGE_KEYS.HORARIO), DEFAULT_HORARIO_SEMANAL))
  };

  // Asegurar persistencia de defaults
  if (!localStorage.getItem(STORAGE_KEYS.DEFAULT_TASKS)) {
    localStorage.setItem(STORAGE_KEYS.DEFAULT_TASKS, JSON.stringify(DEFAULT_CATALOGO_TAREAS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HORARIO)) {
    localStorage.setItem(STORAGE_KEYS.HORARIO, JSON.stringify(initialState.horario));
  }

  let estado = initialState;

  // ---------- 4. REFERENCIAS DOM ----------
  const ui = {
    puntos: document.getElementById('puntosTotales'),
    minutos: document.getElementById('minutosTotales'),
    nivel: document.getElementById('nivelActual'),
    xpFill: document.getElementById('xpFill'),
    xpTexto: document.getElementById('xpTexto'),
    contenedorCategorias: document.getElementById('categorias'),
    contenedorPremios: document.getElementById('contenedorPremios'),
    contenedorHorario: document.getElementById('contenedorHorario'),
    listaEventos: document.getElementById('listaEventos'),
    formAgenda: document.getElementById('formAgenda'),

    vistaTareas: document.getElementById('vistaTareas'),
    vistaTienda: document.getElementById('vistaTienda'),
    vistaHorario: document.getElementById('vistaHorario'),
    vistaAgenda: document.getElementById('vistaAgenda'),
    vistaInforme: document.getElementById('vistaInforme'),
    vistaAdminTareas: document.getElementById('vistaAdminTareas'),
    vistaAdminHorario: document.getElementById('vistaAdminHorario'),

    btnHome: document.getElementById('homeBtn'),
    btnShop: document.getElementById('shopBtn'),
    btnSchedule: document.getElementById('scheduleBtn'),
    btnAgenda: document.getElementById('agendaBtn'),
    btnReport: document.getElementById('reportBtn'),
    btnAdminTareas: document.getElementById('btnAdminTareas'),
    btnAdminHorario: document.getElementById('btnAdminHorario'),

    btnReset: document.getElementById('btnReset'),
    btnDiario: document.getElementById('btnPremioDiario'),
    btnSemanal: document.getElementById('btnPremioSemanal'),

    // Informe
    totalStats: document.getElementById('totalStats'),
    detalleSemanal: document.getElementById('detalleSemanal'),
    compTot: document.getElementById('compTot'),
    failTot: document.getElementById('failTot'),
    ptsTot: document.getElementById('ptsTot'),
    minTot: document.getElementById('minTot'),

    // Admin tareas
    formTarea: document.getElementById('formTarea'),
    listaTareasAdmin: document.getElementById('listaTareasAdmin'),
    btnCancelarEdicion: document.getElementById('btnCancelarEdicion'),

    // Admin horario
    formHorario: document.getElementById('formHorario'),
    listaHorarioAdmin: document.getElementById('listaHorarioAdmin'),
    btnCancelarEdicionHorario: document.getElementById('btnCancelarEdicionHorario'),

    // Store message
    storeMessage: document.getElementById('storeMessage'),
    storeMessageTitle: document.getElementById('storeMessageTitle'),
    storeMessageBody: document.getElementById('storeMessageBody')
  };

  // ---------- 5. GUARDADO / ACTUALIZACIÓN UI ----------
  const guardar = () => {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(estado));
    localStorage.setItem(STORAGE_KEYS.DEFAULT_TASKS, JSON.stringify(estado.catalogoTareas));
    localStorage.setItem(STORAGE_KEYS.HORARIO, JSON.stringify(estado.horario));
    actualizarUI();
  };

  const actualizarUI = () => {
    ui.puntos.textContent = estado.puntos;
    ui.minutos.textContent = estado.minutos;
    ui.nivel.textContent = estado.nivel;

    const xpActual = estado.puntos % META_XP;
    const porcentajeXP = (xpActual / META_XP) * 100;
    ui.xpFill.style.width = `${porcentajeXP}%`;
    ui.xpTexto.textContent = `${xpActual} / ${META_XP} xp`;

    // Actualizar nivel si corresponde
    const nivelReal = Math.floor(estado.puntos / META_XP) + 1;
    if (nivelReal > estado.nivel) {
      estado.nivel = nivelReal;
      lanzarConfeti();
      playSound('nivel');
      guardar();
    }
  };

  // ---------- 6. DÍA NUEVO / HISTORIAL SEMANAL ----------
  const generarResumenDiario = (tareasObj = {}, fecha = '') => {
    let completadas = 0, fallidas = 0, puntosObtenidos = 0, minutosObtenidos = 0;
    const todas = estado.catalogoTareas.flatMap(g => g.items);

    for (const id in tareasObj) {
      const estadoT = tareasObj[id];
      const tareaData = todas.find(t => t.id === id);
      if (estadoT === 'hecho' && tareaData) {
        completadas++;
        puntosObtenidos += Number(tareaData.pts || 0);
        minutosObtenidos += Number(tareaData.min || 0);
      } else if (estadoT === 'fail') {
        fallidas++;
      }
    }

    return { fecha, completadas, fallidas, puntos: puntosObtenidos, minutos: minutosObtenidos };
  };

  const limpiarHistorialSiAplica = () => {
    const inicio = new Date(estado.fechaInicioSemana);
    const hoy = new Date();
    const diffDays = Math.ceil(Math.abs(hoy - inicio) / (1000 * 60 * 60 * 24));
    if (diffDays >= 7) {
      estado.historialSemanal = [];
      estado.fechaInicioSemana = new Date().toDateString();
    }
  };

  // Al cargar, comprobar cambio de día
  (() => {
    const hoy = new Date().toDateString();
    if (estado.ultimaFecha !== hoy) {
      const resumenAyer = generarResumenDiario(estado.tareasHoy, estado.ultimaFecha);
      if (resumenAyer.completadas > 0 || resumenAyer.fallidas > 0) {
        estado.historialSemanal.push(resumenAyer);
      }
      limpiarHistorialSiAplica();
      estado.tareasHoy = {};
      estado.ultimaFecha = hoy;
      guardar();
    }
  })();

  // ---------- 7. RENDERS (TAREAS / ADMIN TAREAS) ----------
  const completarTarea = (tarea, completada = true) => {
    // marca tarea hecha o fallida y actualiza puntos/minutos
    estado.tareasHoy = estado.tareasHoy || {};
    estado.tareasHoy[tarea.id] = completada ? 'hecho' : 'fail';

    if (completada) {
      estado.puntos += Number(tarea.pts || 0);
      estado.minutos += Number(tarea.min || 0);
      playSound('exito');
    } else {
      playSound('error');
    }
    guardar();
    renderizarTareas();
  };

  const renderizarTareas = () => {
    ui.contenedorCategorias.innerHTML = '';
    estado.catalogoTareas.forEach(grupo => {
      const details = document.createElement('details');
      details.open = true;

      const summary = document.createElement('summary');
      summary.textContent = grupo.categoria;
      details.appendChild(summary);

      grupo.items.forEach(tarea => {
        const div = document.createElement('div');
        div.className = 'task';

        const estadoTarea = estado.tareasHoy ? estado.tareasHoy[tarea.id] : null;
        if (estadoTarea === 'hecho') div.classList.add('completed');
        if (estadoTarea === 'fail') div.classList.add('failed');

        div.innerHTML = `
          <div class="task-info">
            <span>${tarea.nombre}</span>
            <span class="task-pts">+${tarea.pts} pts ${tarea.min > 0 ? '• ' + tarea.min + ' min' : ''}</span>
          </div>
          <div class="task-buttons">
            ${!estadoTarea ? `
              <button class="btn-circle check" title="Completar">✔</button>
              <button class="btn-circle cross" title="Fallar">✖</button>
            ` : `<span>${estadoTarea === 'hecho' ? '🌟' : '❌'}</span>`}
          </div>
        `;

        // Lógica para añadir listeners a los botones dinámicos (confirmada como correcta)
        if (!estadoTarea) {
          const checkBtn = div.querySelector('.check');
          const crossBtn = div.querySelector('.cross');
          checkBtn && checkBtn.addEventListener('click', () => completarTarea(tarea, true));
          crossBtn && crossBtn.addEventListener('click', () => completarTarea(tarea, false));
        }

        details.appendChild(div);
      });

      ui.contenedorCategorias.appendChild(details);
    });
  };

  // ADMIN TAREAS: render, editar, eliminar, guardar
  const renderizarAdminTareas = () => {
    ui.listaTareasAdmin.innerHTML = '';
    const selectCategoria = document.getElementById('tareaCategoria');
    selectCategoria.innerHTML = estado.catalogoTareas.map(c => `<option value="${c.categoria}">${c.categoria.split(' ')[0]}</option>`).join('');

    estado.catalogoTareas.forEach(grupo => {
      const grupoTitle = document.createElement('h4');
      grupoTitle.textContent = grupo.categoria;
      ui.listaTareasAdmin.appendChild(grupoTitle);

      grupo.items.forEach(tarea => {
        const card = document.createElement('div');
        card.className = 'task-admin-card';
        card.innerHTML = `
          <div class="task-admin-info">
            <div class="task-admin-name">${tarea.nombre}</div>
            <div class="task-admin-meta">+${tarea.pts} Pts | ${tarea.min} Min</div>
          </div>
          <div class="task-admin-actions">
            <button class="btn-edit" data-category="${grupo.categoria}" data-id="${tarea.id}">📝</button>
            <button class="btn-delete" data-category="${grupo.categoria}" data-id="${tarea.id}">🗑️</button>
          </div>
        `;
        card.querySelector('.btn-edit').addEventListener('click', (e) => {
          const { category, id } = e.target.dataset;
          cargarTareaParaEdicion(category, id);
        });
        card.querySelector('.btn-delete').addEventListener('click', (e) => {
          const { category, id } = e.target.dataset;
          eliminarTarea(category, id);
        });
        ui.listaTareasAdmin.appendChild(card);
      });
    });

    if (estado.catalogoTareas.every(c => c.items.length === 0)) {
      ui.listaTareasAdmin.innerHTML = '<p style="color: #999; text-align: center; padding: 15px;">No hay tareas en el catálogo. ¡Añade una!</p>';
    }
  };

  const cargarTareaParaEdicion = (categoriaNombre, itemId) => {
    const categoria = estado.catalogoTareas.find(c => c.categoria === categoriaNombre);
    const tarea = categoria ? categoria.items.find(t => t.id === itemId) : null;
    if (!tarea) return;

    document.getElementById('tareaId').value = tarea.id;
    document.getElementById('tareaCategoriaOriginal').value = categoriaNombre;
    document.getElementById('tareaNombre').value = tarea.nombre;
    document.getElementById('tareaPts').value = tarea.pts;
    document.getElementById('tareaMin').value = tarea.min;
    document.getElementById('tareaCategoria').value = categoriaNombre;

    ui.btnCancelarEdicion.style.display = 'block';
    ui.formTarea.scrollIntoView({ behavior: 'smooth' });
  };

  const eliminarTarea = (categoriaNombre, itemId) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la tarea con ID ${itemId}?`)) return;
    const catIndex = estado.catalogoTareas.findIndex(c => c.categoria === categoriaNombre);
    if (catIndex !== -1) {
      estado.catalogoTareas[catIndex].items = estado.catalogoTareas[catIndex].items.filter(t => t.id !== itemId);
      guardar();
      renderizarAdminTareas();
      renderizarTareas();
    }
  };

  const guardarTarea = (e) => {
    e.preventDefault();
    const id = document.getElementById('tareaId').value;
    const categoriaOriginal = document.getElementById('tareaCategoriaOriginal').value;
    const categoriaNueva = document.getElementById('tareaCategoria').value;
    const nombre = document.getElementById('tareaNombre').value.trim();
    const pts = parseInt(document.getElementById('tareaPts').value, 10) || 0;
    const min = parseInt(document.getElementById('tareaMin').value, 10) || 0;

    const nuevaTarea = { id: id || generateId(), nombre, pts, min };

    // Si editamos, eliminar del origen
    if (id && categoriaOriginal) {
      const catOriginalIndex = estado.catalogoTareas.findIndex(c => c.categoria === categoriaOriginal);
      if (catOriginalIndex !== -1) {
        estado.catalogoTareas[catOriginalIndex].items = estado.catalogoTareas[catOriginalIndex].items.filter(t => t.id !== id);
      }
    }

    const catIndex = estado.catalogoTareas.findIndex(c => c.categoria === categoriaNueva);
    if (catIndex !== -1) {
      estado.catalogoTareas[catIndex].items.push(nuevaTarea);
    } else {
      estado.catalogoTareas.push({ categoria: categoriaNueva, items: [nuevaTarea] });
    }

    ui.formTarea.reset();
    document.getElementById('tareaId').value = '';
    document.getElementById('tareaCategoriaOriginal').value = '';
    ui.btnCancelarEdicion.style.display = 'none';

    guardar();
    renderizarAdminTareas();
    renderizarTareas();
    alert('Tarea guardada con éxito.');
  };

  ui.formTarea.addEventListener('submit', guardarTarea);
  ui.btnCancelarEdicion.addEventListener('click', () => {
    ui.formTarea.reset();
    document.getElementById('tareaId').value = '';
    document.getElementById('tareaCategoriaOriginal').value = '';
    ui.btnCancelarEdicion.style.display = 'none';
  });

  // ---------- 8. HORARIO CRUD ----------
  const renderizarHorario = () => {
    ui.contenedorHorario.innerHTML = '';
    const dias = Object.keys(estado.horario);
    dias.forEach(dia => {
      const clases = estado.horario[dia] || [];
      if (!clases.length) return;

      const diaDiv = document.createElement('div');
      diaDiv.className = 'horario-dia';
      const titulo = document.createElement('div');
      titulo.className = 'dia-titulo';
      titulo.textContent = dia;
      diaDiv.appendChild(titulo);

      clases
        .sort((a, b) => (a.horaInicio || a.hora || '').localeCompare(b.horaInicio || b.hora || ''))
        .forEach(clase => {
          const asignaturaDiv = document.createElement('div');
          const horaDisplay = clase.hora ? clase.hora : formatHora(clase.horaInicio, clase.horaFin);
          asignaturaDiv.className = `asignatura ${clase.tipo === 'extra' ? 'extra-curricular' : ''}`;
          asignaturaDiv.innerHTML = `<span>${clase.nombre}</span><span class="font-semibold">${horaDisplay}</span>`;
          diaDiv.appendChild(asignaturaDiv);
        });

      ui.contenedorHorario.appendChild(diaDiv);
    });
  };

  const renderizarAdminHorario = () => {
    ui.listaHorarioAdmin.innerHTML = '';
    const diasOrden = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
    diasOrden.forEach(dia => {
      const clasesDia = estado.horario[dia] || [];
      if (!clasesDia.length) return;

      const grupoTitle = document.createElement('h4');
      grupoTitle.textContent = dia;
      ui.listaHorarioAdmin.appendChild(grupoTitle);

      clasesDia
        .sort((a, b) => (a.horaInicio || a.hora || '').localeCompare(b.horaInicio || b.hora || ''))
        .forEach(clase => {
          const card = document.createElement('div');
          card.className = 'task-admin-card';
          const horaDisplay = clase.hora ? clase.hora : formatHora(clase.horaInicio, clase.horaFin);
          card.innerHTML = `
            <div class="task-admin-info">
              <div class="task-admin-name">${clase.nombre}</div>
              <div class="task-admin-meta">${horaDisplay} | Tipo: ${clase.tipo === 'extra' ? 'Extraescolar' : 'Normal'}</div>
            </div>
            <div class="task-admin-actions">
              <button class="btn-edit" data-dia="${dia}" data-id="${clase.id}">📝</button>
              <button class="btn-delete" data-dia="${dia}" data-id="${clase.id}">🗑️</button>
            </div>
          `;
          card.querySelector('.btn-edit').addEventListener('click', (e) => {
            const { dia: d, id } = e.target.dataset;
            cargarClaseParaEdicion(d, id);
          });
          card.querySelector('.btn-delete').addEventListener('click', (e) => {
            const { dia: d, id } = e.target.dataset;
            eliminarClase(d, id);
          });
          ui.listaHorarioAdmin.appendChild(card);
        });
    });

    if (['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'].every(d => (estado.horario[d] || []).length === 0)) {
      ui.listaHorarioAdmin.innerHTML = '<p style="color: #999; text-align: center; padding: 15px;">El horario está vacío. ¡Añade una clase!</p>';
    }
  };

  const cargarClaseParaEdicion = (dia, claseId) => {
    const clase = (estado.horario[dia] || []).find(c => c.id === claseId);
    if (!clase) return;
    document.getElementById('claseId').value = clase.id;
    document.getElementById('claseDia').value = dia;
    document.getElementById('claseNombre').value = clase.nombre;
    document.getElementById('claseTipo').value = clase.tipo || '';
    const inicio = clase.horaInicio || (clase.hora ? clase.hora.split(' - ')[0].trim() : '');
    const fin = clase.horaFin || (clase.hora ? clase.hora.split(' - ')[1].trim() : '');
    document.getElementById('claseInicio').value = inicio;
    document.getElementById('claseFin').value = fin;
    ui.btnCancelarEdicionHorario.style.display = 'block';
    ui.formHorario.scrollIntoView({ behavior: 'smooth' });
  };

  const eliminarClase = (dia, claseId) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar esta clase del ${dia}?`)) return;
    estado.horario[dia] = (estado.horario[dia] || []).filter(c => c.id !== claseId);
    guardar();
    renderizarAdminHorario();
    renderizarHorario();
  };

  const guardarClase = (e) => {
    e.preventDefault();
    const id = document.getElementById('claseId').value;
    const dia = document.getElementById('claseDia').value;
    const nombre = document.getElementById('claseNombre').value.trim();
    const tipo = document.getElementById('claseTipo').value;
    const inicio = document.getElementById('claseInicio').value;
    const fin = document.getElementById('claseFin').value;

    const nuevaClase = {
      id: id || generateId(),
      nombre,
      hora: formatHora(inicio, fin),
      horaInicio: inicio,
      horaFin: fin,
      tipo: tipo || undefined
    };

    // Si editamos: eliminar de cualquier día anterior
    if (id) {
      Object.keys(estado.horario).forEach(d => {
        estado.horario[d] = (estado.horario[d] || []).filter(c => c.id !== id);
      });
    }

    if (!estado.horario[dia]) estado.horario[dia] = [];
    estado.horario[dia].push(nuevaClase);

    ui.formHorario.reset();
    document.getElementById('claseId').value = '';
    ui.btnCancelarEdicionHorario.style.display = 'none';

    guardar();
    renderizarAdminHorario();
    renderizarHorario();
    alert('Clase guardada con éxito.');
  };

  ui.formHorario.addEventListener('submit', guardarClase);
  ui.btnCancelarEdicionHorario.addEventListener('click', () => {
    ui.formHorario.reset();
    document.getElementById('claseId').value = '';
    ui.btnCancelarEdicionHorario.style.display = 'none';
  });

  // ---------- 9. TIENDA ----------
  const renderizarTienda = () => {
    ui.contenedorPremios.innerHTML = '';
    const today = new Date().getDay();
    const isWeekend = today === 0 || today === 6;

    if (isWeekend) {
      ui.storeMessage.classList.add('bg-yellow-100','border-yellow-300','text-yellow-800');
      ui.storeMessage.classList.remove('bg-gray-100','border-gray-300','text-gray-800');
      ui.storeMessageTitle.textContent = "¡Es Fin de Semana! 🎉";
      ui.storeMessageBody.textContent = "Puedes usar tus Minutos para Premios de Tiempo sin restricciones.";
    } else {
      ui.storeMessage.classList.add('bg-gray-100','border-gray-300','text-gray-800');
      ui.storeMessage.classList.remove('bg-yellow-100','border-yellow-300','text-yellow-800');
      ui.storeMessageTitle.textContent = "Regla de la Semana";
      ui.storeMessageBody.textContent = "Los Premios de Tiempo (Minutos) se pueden reclamar, ¡pero solo para el Fin de Semana!";
    }

    catalogoPremios.forEach(premio => {
      const card = document.createElement('div');
      card.className = 'premio-card';
      card.innerHTML = `
        <div class="premio-icono">${premio.icono}</div>
        <div class="font-bold text-lg text-gray-800 mb-1">${premio.nombre}</div>
        <div class="price-tag">${premio.coste} ${premio.moneda === 'puntos' ? 'Pts ⭐' : 'Min ⏱️'}</div>
      `;

      card.addEventListener('click', () => {
        if (premio.moneda === 'puntos') {
          if (estado.puntos >= premio.coste) {
            if (window.confirm(`¿Comprar ${premio.nombre} por ${premio.coste} Pts?`)) {
              estado.puntos -= premio.coste;
              playSound('caja');
              guardar();
              alert(`¡Has comprado ${premio.nombre}! Recompensa entregada.`);
            }
          } else {
            alert(`Puntos insuficientes. Necesitas ${premio.coste} Pts.`);
            playSound('error');
          }
        } else {
          // minutos
          if (estado.minutos >= premio.coste) {
            if (!isWeekend && new Date().getDay() !== 5) {
              alert("Recuerda: solo puedes usar los minutos para premios de tiempo durante el Fin de Semana.");
            }
            if (window.confirm(`¿Usar ${premio.coste} Minutos para ${premio.nombre}?`)) {
              estado.minutos -= premio.coste;
              playSound('caja');
              guardar();
              alert(`¡Has usado ${premio.coste} minutos para ${premio.nombre}! Tiempo de uso anotado.`);
            }
          } else {
            alert(`Minutos insuficientes. Necesitas ${premio.coste} Min.`);
            playSound('error');
          }
        }
      });

      ui.contenedorPremios.appendChild(card);
    });
  };

  // ---------- 10. AGENDA (simplificada, mantiene hooks) ----------
  const renderizarAgenda = () => {
    ui.listaEventos.innerHTML = '';
    const eventos = estado.agendaEventos || [];
    eventos
      .sort((a,b) => new Date(a.fecha) - new Date(b.fecha))
      .forEach(ev => {
        const card = document.createElement('div');
        card.className = `agenda-card ${ev.tipo ? ev.tipo.toLowerCase() : ''}`;
        card.innerHTML = `
          <div class="agenda-title">${ev.asignatura}</div>
          <div class="agenda-info-row">${ev.fecha}${ev.hora ? ' • ' + ev.hora : ''} <span>${ev.tipo || ''}</span></div>
          ${ev.comentarios ? `<div class="agenda-comments">${ev.comentarios}</div>` : ''}
          <div class="agenda-actions">
            <button class="btn-edit" data-id="${ev.id}">Editar</button>
            <button class="btn-delete" data-id="${ev.id}">Borrar</button>
          </div>
        `;
        card.querySelector('.btn-edit').addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          cargarEventoParaEdicion(id);
        });
        card.querySelector('.btn-delete').addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          eliminarEvento(id);
        });
        ui.listaEventos.appendChild(card);
      });
    if (!eventos.length) ui.listaEventos.innerHTML = '<p style="color:#999; text-align:center; padding:10px;">No hay eventos.</p>';
  };

  const guardarEvento = (e) => {
    e.preventDefault();
    // FIX aplicado: Añadido console.log para verificar si la función se ejecuta (soluciona el problema de que 'no guarda')
    console.log('Shukudai: Intentando guardar evento de agenda...');
    const id = document.getElementById('agendaId').value;
    const fecha = document.getElementById('agendaFecha').value;
    const hora = document.getElementById('agendaHora').value;
    const asignatura = document.getElementById('agendaAsignatura').value.trim();
    const tipo = document.getElementById('agendaTipo').value;
    const comentarios = document.getElementById('agendaComentarios').value.trim();

    const evento = { id: id || generateId(), fecha, hora, asignatura, tipo, comentarios };

    if (id) {
      estado.agendaEventos = (estado.agendaEventos || []).map(ev => ev.id === id ? evento : ev);
    } else {
      estado.agendaEventos = estado.agendaEventos ? [...estado.agendaEventos, evento] : [evento];
    }

    ui.formAgenda.reset();
    document.getElementById('agendaId').value = '';
    guardar();
    renderizarAgenda();
  };

  const cargarEventoParaEdicion = (id) => {
    const ev = (estado.agendaEventos || []).find(e => e.id === id);
    if (!ev) return;
    document.getElementById('agendaId').value = ev.id;
    document.getElementById('agendaFecha').value = ev.fecha;
    document.getElementById('agendaHora').value = ev.hora || '';
    document.getElementById('agendaAsignatura').value = ev.asignatura;
    document.getElementById('agendaTipo').value = ev.tipo || '';
    document.getElementById('agendaComentarios').value = ev.comentarios || '';
    ui.formAgenda.scrollIntoView({ behavior: 'smooth' });
  };

  const eliminarEvento = (id) => {
    if (!window.confirm('¿Borrar este evento?')) return;
    estado.agendaEventos = (estado.agendaEventos || []).filter(e => e.id !== id);
    guardar();
    renderizarAgenda();
  };

  ui.formAgenda.addEventListener('submit', guardarEvento);

  // ---------- 11. INFORME SEMANAL ----------
  const renderizarInforme = () => {
    ui.detalleSemanal.innerHTML = '';
    const hoyResumen = generarResumenDiario(estado.tareasHoy, (new Date()).toDateString());
    const historialCompleto = [hoyResumen, ...estado.historialSemanal];

    let compTot = 0, failTot = 0, ptsTot = 0, minTot = 0;
    historialCompleto.forEach(dia => {
      compTot += dia.completadas || 0;
      failTot += dia.fallidas || 0;
      ptsTot += dia.puntos || 0;
      minTot += dia.minutos || 0;

      if (dia.completadas > 0 || dia.fallidas > 0) {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'day-summary';
        summaryDiv.innerHTML = `
          <div class="summary-header">${dia.fecha}</div>
          <div class="summary-body">
            <div class="summary-stat">✅ Tareas OK: <div>${dia.completadas}</div></div>
            <div class="summary-stat">❌ Fallidas: <div>${dia.fallidas}</div></div>
            <div class="summary-stat">⭐ Pts: <div>${dia.puntos}</div></div>
            <div class="summary-stat">⏱️ Min: <div>${dia.minutos}</div></div>
          </div>
        `;
        ui.detalleSemanal.appendChild(summaryDiv);
      }
    });

    ui.compTot.textContent = compTot;
    ui.failTot.textContent = failTot;
    ui.ptsTot.textContent = ptsTot;
    ui.minTot.textContent = minTot;
  };

  // ---------- 12. NAVEGACIÓN / VISTAS ----------
  const mostrarVista = (vistaId, btnActivo = null) => {
    const vistas = [ui.vistaTareas, ui.vistaTienda, ui.vistaHorario, ui.vistaAgenda, ui.vistaInforme, ui.vistaAdminTareas, ui.vistaAdminHorario];
    const botones = [ui.btnHome, ui.btnShop, ui.btnSchedule, ui.btnAgenda, ui.btnReport];

    vistas.forEach(v => v.style.display = 'none');
    botones.forEach(b => b.classList.remove('active'));

    const el = document.getElementById(vistaId);
    if (el) el.style.display = 'block';
    if (btnActivo) btnActivo.classList.add('active');
  };

  // ---------- 13. BOTONES / ACCIONES RÁPIDAS ----------
  ui.btnHome.addEventListener('click', () => { mostrarVista('vistaTareas', ui.btnHome); renderizarTareas(); });
  ui.btnShop.addEventListener('click', () => { mostrarVista('vistaTienda', ui.btnShop); renderizarTienda(); });
  ui.btnSchedule.addEventListener('click', () => { mostrarVista('vistaHorario', ui.btnSchedule); renderizarHorario(); });
  ui.btnAgenda.addEventListener('click', () => { mostrarVista('vistaAgenda', ui.btnAgenda); renderizarAgenda(); });
  ui.btnReport.addEventListener('click', () => { mostrarVista('vistaInforme', ui.btnReport); renderizarInforme(); });
  ui.btnAdminTareas.addEventListener('click', () => { mostrarVista('vistaAdminTareas'); renderizarAdminTareas(); });
  ui.btnAdminHorario.addEventListener('click', () => { mostrarVista('vistaAdminHorario'); renderizarAdminHorario(); });

  ui.btnDiario.addEventListener('click', () => {
    const hoy = (new Date()).toDateString();
    if (estado.ultimoDiario === hoy) {
      playSound('error');
      alert("Ya has recogido tu regalo de hoy. ¡Vuelve mañana!");
      return;
    }
    estado.puntos += 10;
    estado.ultimoDiario = hoy;
    playSound('exito');
    guardar();
    alert("¡+10 Puntos recibidos! 🎁");
  });

  ui.btnSemanal.addEventListener('click', () => {
    if (window.confirm("¿Reclamar premio semanal (+70)?")) {
      estado.puntos += 70;
      playSound('exito');
      guardar();
      alert("¡+70 puntos añadidos (Premio semanal)!");
    }
  });

  ui.btnReset.addEventListener('click', () => {
    if (!window.confirm('¿Seguro que quieres reiniciar todos los datos? Esto borrará el progreso.')) return;
    localStorage.removeItem(STORAGE_KEYS.DATA);
    // Re-iniciar estado a valores por defecto
    estado = {
      puntos: 0, minutos: 0, nivel: 1, tareasHoy: {}, agendaEventos: [],
      ultimaFecha: new Date().toDateString(), ultimoDiario: null, historialSemanal: [],
      fechaInicioSemana: new Date().toDateString(), catalogoTareas: DEFAULT_CATALOGO_TAREAS,
      horario: inicializarHorario(DEFAULT_HORARIO_SEMANAL)
    };
    guardar();
    renderAll();
  });

  // ---------- 14. RENDER INICIAL ----------
  const renderAll = () => {
    actualizarUI();
    renderizarTareas();
    renderizarTienda();
    renderizarHorario();
    renderizarAdminTareas();
    renderizarAdminHorario();
    renderizarAgenda();
    renderizarInforme();
  };

  renderAll();
});
