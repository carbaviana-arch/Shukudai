document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN ---
    // SHUKUDAI 3.2: Horario personalizable (Admin CRUD)
    const META_XP = 125; 
    
    // Sonidos (URLs estables de Google CDN)
    const SONIDOS = {
        exito: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
        nivel: new Audio('https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'),
        error: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
        caja: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg')
    };

    // --- HORARIO SEMANAL POR DEFECTO (USADO SOLO PARA INICIALIZACIÓN) ---
    // Se elimina la constante original y se renombra para usarse en la inicialización
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
    
    // --- LISTADO DE TAREAS POR DEFECTO (USADO SOLO PARA INICIALIZACIÓN) ---
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

    // --- CATÁLOGO DE PREMIOS (SIN CAMBIOS) ---
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
    
    // Función auxiliar para inicializar el horario con IDs y separar hora
    function inicializarHorario(horario) {
        let idCounter = 1;
        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        const nuevoHorario = {};

        dias.forEach(dia => {
            nuevoHorario[dia] = horario[dia] || [];
            nuevoHorario[dia] = nuevoHorario[dia].map(clase => {
                if (!clase.id) {
                    clase.id = generarId(); // Usar la función generarId existente
                    // Separar hora en inicio y fin si está en formato "inicio - fin"
                    if (clase.hora && clase.hora.includes(' - ')) {
                        const [inicio, fin] = clase.hora.split(' - ');
                        clase.horaInicio = inicio.trim();
                        clase.horaFin = fin.trim();
                    }
                }
                return clase;
            });
        });
        return nuevoHorario;
    }

    // --- 2. ESTADO Y PERSISTENCIA (USANDO LOCALSTORAGE) ---
    // Versión 3.2: Horario y Tareas personalizables
    let estado = JSON.parse(localStorage.getItem('shukudai_v3_data')) || {
        puntos: 0,
        minutos: 0,
        nivel: 1,
        tareasHoy: {},
        agendaEventos: [], 
        ultimaFecha: new Date().toDateString(),
        ultimoDiario: null,
        historialSemanal: [], 
        fechaInicioSemana: new Date().toDateString(),
        // Catálogo de tareas persistente
        catalogoTareas: JSON.parse(localStorage.getItem('shukudai_v3_default_tasks')) || DEFAULT_CATALOGO_TAREAS,
        // NUEVO: Horario persistente (inicializado/migrado)
        horario: inicializarHorario(JSON.parse(localStorage.getItem('shukudai_v3_horario')) || DEFAULT_HORARIO_SEMANAL)
    };
    
    // Asegurar que las tareas y el horario por defecto se guarden si no existen
    if (!localStorage.getItem('shukudai_v3_default_tasks')) {
        localStorage.setItem('shukudai_v3_default_tasks', JSON.stringify(DEFAULT_CATALOGO_TAREAS));
    }
    if (!localStorage.getItem('shukudai_v3_horario')) {
        localStorage.setItem('shukudai_v3_horario', JSON.stringify(estado.horario));
    }


    // --- 3. LÓGICA DE NUEVO DÍA Y ARCHIVO SEMANAL ---
    // ... (El resto de esta sección no cambia, utiliza generarResumenDiario) ...
    function generarResumenDiario(tareas, fecha) {
        let completadas = 0;
        let fallidas = 0;
        let puntosObtenidos = 0;
        let minutosObtenidos = 0;
        
        const todasLasTareas = estado.catalogoTareas.flatMap(c => c.items); 

        for (const id in tareas) {
            const estado = tareas[id];
            const tareaData = todasLasTareas.find(t => t.id === id);
            
            if (estado === 'hecho' && tareaData) {
                completadas++;
                puntosObtenidos += tareaData.pts;
                minutosObtenidos += tareaData.min;
            } else if (estado === 'fail') {
                fallidas++;
            }
        }

        return {
            fecha: fecha,
            completadas: completadas,
            fallidas: fallidas,
            puntos: puntosObtenidos,
            minutos: minutosObtenidos
        };
    }
    
    function limpiarHistorialSiAplica() {
        const inicio = new Date(estado.fechaInicioSemana);
        const hoy = new Date();
        const diffTime = Math.abs(hoy - inicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays >= 7) { 
            console.log("Reiniciando ciclo semanal de informe.");
            estado.historialSemanal = []; 
            estado.fechaInicioSemana = new Date().toDateString();
        }
    }


    const hoy = new Date().toDateString();
    if (estado.ultimaFecha !== hoy) {
        console.log("¡Nuevo día detectado! Archivando tareas de ayer...");
        
        const ayer = estado.ultimaFecha;
        const resumenAyer = generarResumenDiario(estado.tareasHoy, ayer);
        
        if (resumenAyer.completadas > 0 || resumenAyer.fallidas > 0) {
             estado.historialSemanal.push(resumenAyer);
        }
        
        limpiarHistorialSiAplica(); 
        
        estado.tareasHoy = {}; 
        estado.ultimaFecha = hoy;
        guardar();
    }

    // --- 4. REFERENCIAS DOM ---
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
        vistaAdminHorario: document.getElementById('vistaAdminHorario'), // NUEVA VISTA
        
        btnHome: document.getElementById('homeBtn'),
        btnShop: document.getElementById('shopBtn'),
        btnSchedule: document.getElementById('scheduleBtn'),
        btnAgenda: document.getElementById('agendaBtn'),
        btnReport: document.getElementById('reportBtn'), 
        btnAdminTareas: document.getElementById('btnAdminTareas'), 
        btnAdminHorario: document.getElementById('btnAdminHorario'), // NUEVO BOTÓN
        
        btnReset: document.getElementById('btnReset'),
        btnDiario: document.getElementById('btnPremioDiario'),
        btnSemanal: document.getElementById('btnPremioSemanal'),
        
        // Referencias para el informe
        totalStats: document.getElementById('totalStats'),
        detalleSemanal: document.getElementById('detalleSemanal'),
        compTot: document.getElementById('compTot'),
        failTot: document.getElementById('failTot'),
        ptsTot: document.getElementById('ptsTot'),
        minTot: document.getElementById('minTot'),
        
        // Referencias para Admin Tareas
        formTarea: document.getElementById('formTarea'),
        listaTareasAdmin: document.getElementById('listaTareasAdmin'),
        btnCancelarEdicion: document.getElementById('btnCancelarEdicion'),
        
        // Referencias para Admin Horario
        formHorario: document.getElementById('formHorario'),
        listaHorarioAdmin: document.getElementById('listaHorarioAdmin'),
        btnCancelarEdicionHorario: document.getElementById('btnCancelarEdicionHorario')
    };
    
    // --- 5. FUNCIONES DE UTILIDAD ---
    
    function guardar() {
        localStorage.setItem('shukudai_v3_data', JSON.stringify(estado));
        localStorage.setItem('shukudai_v3_default_tasks', JSON.stringify(estado.catalogoTareas));
        localStorage.setItem('shukudai_v3_horario', JSON.stringify(estado.horario)); // NUEVO: Guardar Horario
        actualizarUI(); 
    }
    
    function generarId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    
    function actualizarUI() {
        // ... (lógica de marcador y XP sin cambios) ...
        ui.puntos.textContent = estado.puntos;
        ui.minutos.textContent = estado.minutos;
        
        ui.nivel.textContent = estado.nivel;
        
        const xpActual = estado.puntos % META_XP;
        const porcentajeXP = (xpActual / META_XP) * 100;
        
        ui.xpFill.style.width = `${porcentajeXP}%`;
        ui.xpTexto.textContent = `${xpActual} / ${META_XP} xp`;
        
        const nivelReal = Math.floor(estado.puntos / META_XP) + 1;
        if (nivelReal > estado.nivel) {
            estado.nivel = nivelReal;
            lanzarConfeti();
            reproducir('nivel');
            console.log(`🎉 ¡INCREÍBLE! ¡Has subido al NIVEL ${estado.nivel}! 🎉`);
            guardar();
        }
    }

    function reproducir(tipo) {
        if (SONIDOS[tipo]) {
            SONIDOS[tipo].currentTime = 0;
            SONIDOS[tipo].play().catch(err => console.log("Audio bloqueado:", err));
        }
    }

    function lanzarConfeti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
    
    function mostrarVista(vistaId, btnActivo = null) {
        // Incluir la nueva vista de administración de horario
        const vistas = [ui.vistaTareas, ui.vistaTienda, ui.vistaHorario, ui.vistaAgenda, ui.vistaInforme, ui.vistaAdminTareas, ui.vistaAdminHorario]; 
        const botones = [ui.btnHome, ui.btnShop, ui.btnSchedule, ui.btnAgenda, ui.btnReport]; 
        
        vistas.forEach(v => v.style.display = 'none');
        botones.forEach(b => b.classList.remove('active'));
        
        document.getElementById(vistaId).style.display = 'block';
        if (btnActivo) {
            btnActivo.classList.add('active');
        }
    }

    // --- 6. RENDERIZADO DE VISTAS ---
    
    function renderizarTareas() {
        ui.contenedorCategorias.innerHTML = '';
        estado.catalogoTareas.forEach(grupo => {
            // ... (Lógica de renderizado de tareas sin cambios) ...
            const details = document.createElement('details');
            details.open = true;
            
            const summary = document.createElement('summary');
            summary.textContent = grupo.categoria;
            details.appendChild(summary);
            
            grupo.items.forEach(tarea => {
                const div = document.createElement('div');
                div.className = 'task';
                
                const estadoTarea = estado.tareasHoy[tarea.id];
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
                        ` : `
                            <span>${estadoTarea === 'hecho' ? '🌟' : '❌'}</span>
                        `}
                    </div>
                `;
                
                if (!estadoTarea) {
                    div.querySelector('.check').addEventListener('click', () => completarTarea(tarea, true));
                    div.querySelector('.cross').addEventListener('click', () => completarTarea(tarea, false));
                }
                
                details.appendChild(div);
            });
            
            ui.contenedorCategorias.appendChild(details);
        });
    }

    // --- LÓGICA CRUD TAREAS (SIN CAMBIOS) ---
    // ... (renderizarAdminTareas, cargarTareaParaEdicion, eliminarTarea, guardarTarea) ...
    function renderizarAdminTareas() {
        ui.listaTareasAdmin.innerHTML = '';
        
        const selectCategoria = document.getElementById('tareaCategoria');
        selectCategoria.innerHTML = estado.catalogoTareas.map(c => 
            `<option value="${c.categoria}">${c.categoria.split(' ')[0]}</option>`
        ).join('');

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
                        <div class="task-admin-meta">
                            +${tarea.pts} Pts | ${tarea.min} Min
                        </div>
                    </div>
                    <div class="task-admin-actions">
                        <button class="btn-edit" data-category="${grupo.categoria}" data-id="${tarea.id}">📝</button>
                        <button class="btn-delete" data-category="${grupo.categoria}" data-id="${tarea.id}">🗑️</button>
                    </div>
                `;
                
                card.querySelector('.btn-edit').addEventListener('click', (e) => 
                    cargarTareaParaEdicion(e.target.dataset.category, e.target.dataset.id)
                );
                card.querySelector('.btn-delete').addEventListener('click', (e) => 
                    eliminarTarea(e.target.dataset.category, e.target.dataset.id)
                );

                ui.listaTareasAdmin.appendChild(card);
            });
        });
        
        if (estado.catalogoTareas.every(c => c.items.length === 0)) {
            ui.listaTareasAdmin.innerHTML = '<p style="color: #999; text-align: center; padding: 15px;">No hay tareas en el catálogo. ¡Añade una!</p>';
        }
    }
    
    function cargarTareaParaEdicion(categoriaNombre, itemId) {
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
    }

    function eliminarTarea(categoriaNombre, itemId) {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la tarea con ID ${itemId}?`)) {
            return;
        }

        const categoriaIndex = estado.catalogoTareas.findIndex(c => c.categoria === categoriaNombre);
        if (categoriaIndex !== -1) {
            estado.catalogoTareas[categoriaIndex].items = 
                estado.catalogoTareas[categoriaIndex].items.filter(t => t.id !== itemId);
            guardar();
            renderizarAdminTareas();
            renderizarTareas(); 
            console.log('Tarea eliminada.');
        }
    }

    function guardarTarea(e) {
        e.preventDefault();

        const id = document.getElementById('tareaId').value;
        const categoriaOriginal = document.getElementById('tareaCategoriaOriginal').value;
        const categoriaNueva = document.getElementById('tareaCategoria').value;
        const nombre = document.getElementById('tareaNombre').value;
        const pts = parseInt(document.getElementById('tareaPts').value);
        const min = parseInt(document.getElementById('tareaMin').value);

        const nuevaTarea = {
            id: id || generarId(),
            nombre,
            pts,
            min
        };

        if (id && categoriaOriginal) {
            const catOriginalIndex = estado.catalogoTareas.findIndex(c => c.categoria === categoriaOriginal);
            if (catOriginalIndex !== -1) {
                estado.catalogoTareas[catOriginalIndex].items = 
                    estado.catalogoTareas[catOriginalIndex].items.filter(t => t.id !== id);
            }
        }
        
        const catNuevaIndex = estado.catalogoTareas.findIndex(c => c.categoria === categoriaNueva);
        if (catNuevaIndex !== -1) {
            estado.catalogoTareas[catNuevaIndex].items.push(nuevaTarea);
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
    }
    
    ui.formTarea.addEventListener('submit', guardarTarea);
    ui.btnCancelarEdicion.addEventListener('click', () => {
        ui.formTarea.reset();
        document.getElementById('tareaId').value = '';
        document.getElementById('tareaCategoriaOriginal').value = '';
        ui.btnCancelarEdicion.style.display = 'none';
    });


    // --- LÓGICA HORARIO CRUD (NUEVO) ---
    function formatHora(inicio, fin) {
        return `${inicio} - ${fin}`;
    }

    function renderizarHorario() {
        ui.contenedorHorario.innerHTML = '';
        const horario = estado.horario;
        const dias = Object.keys(horario);
        
        dias.forEach(dia => {
            if (horario[dia] && horario[dia].length > 0) {
                const diaDiv = document.createElement('div');
                diaDiv.className = 'horario-dia';
                
                const titulo = document.createElement('div');
                titulo.className = 'dia-titulo';
                titulo.textContent = dia;
                diaDiv.appendChild(titulo);

                horario[dia]
                    // Ordenar por hora de inicio (horaInicio es el formato HH:MM)
                    .sort((a, b) => (a.horaInicio || a.hora).localeCompare(b.horaInicio || b.hora)) 
                    .forEach(clase => {
                        const asignaturaDiv = document.createElement('div');
                        const horaDisplay = clase.hora ? clase.hora : formatHora(clase.horaInicio, clase.horaFin);
                        
                        asignaturaDiv.className = `asignatura ${clase.tipo === 'extra' ? 'extra-curricular' : ''}`;
                        asignaturaDiv.innerHTML = `
                            <span>${clase.nombre}</span>
                            <span class="font-semibold">${horaDisplay}</span>
                        `;
                        diaDiv.appendChild(asignaturaDiv);
                    });
                ui.contenedorHorario.appendChild(diaDiv);
            }
        });
    }

    function renderizarAdminHorario() {
        ui.listaHorarioAdmin.innerHTML = '';
        
        const diasOrden = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        
        diasOrden.forEach(dia => {
            const clasesDia = estado.horario[dia] || [];
            
            if (clasesDia.length > 0) {
                const grupoTitle = document.createElement('h4');
                grupoTitle.textContent = dia;
                ui.listaHorarioAdmin.appendChild(grupoTitle);

                clasesDia
                    .sort((a, b) => (a.horaInicio || a.hora).localeCompare(b.horaInicio || b.hora)) 
                    .forEach(clase => {
                        const card = document.createElement('div');
                        card.className = 'task-admin-card'; 
                        
                        const horaDisplay = clase.hora ? clase.hora : formatHora(clase.horaInicio, clase.horaFin);
                        
                        card.innerHTML = `
                            <div class="task-admin-info">
                                <div class="task-admin-name">${clase.nombre}</div>
                                <div class="task-admin-meta">
                                    ${horaDisplay} | Tipo: ${clase.tipo === 'extra' ? 'Extraescolar' : 'Normal'}
                                </div>
                            </div>
                            <div class="task-admin-actions">
                                <button class="btn-edit" data-dia="${dia}" data-id="${clase.id}">📝</button>
                                <button class="btn-delete" data-dia="${dia}" data-id="${clase.id}">🗑️</button>
                            </div>
                        `;
                        
                        card.querySelector('.btn-edit').addEventListener('click', (e) => 
                            cargarClaseParaEdicion(e.target.dataset.dia, e.target.dataset.id)
                        );
                        card.querySelector('.btn-delete').addEventListener('click', (e) => 
                            eliminarClase(e.target.dataset.dia, e.target.dataset.id)
                        );

                        ui.listaHorarioAdmin.appendChild(card);
                    });
            }
        });
        
        if (diasOrden.every(d => (estado.horario[d] || []).length === 0)) {
            ui.listaHorarioAdmin.innerHTML = '<p style="color: #999; text-align: center; padding: 15px;">El horario está vacío. ¡Añade una clase!</p>';
        }
    }

    function cargarClaseParaEdicion(dia, claseId) {
        const clase = (estado.horario[dia] || []).find(c => c.id === claseId);
        if (!clase) return;

        document.getElementById('claseId').value = clase.id;
        document.getElementById('claseDia').value = dia;
        document.getElementById('claseNombre').value = clase.nombre;
        document.getElementById('claseTipo').value = clase.tipo || '';
        
        // Usar horaInicio/horaFin (que ya se establecen en inicializarHorario)
        const inicio = clase.horaInicio || (clase.hora ? clase.hora.split(' - ')[0].trim() : '');
        const fin = clase.horaFin || (clase.hora ? clase.hora.split(' - ')[1].trim() : '');
        
        document.getElementById('claseInicio').value = inicio;
        document.getElementById('claseFin').value = fin;

        ui.btnCancelarEdicionHorario.style.display = 'block';
        
        ui.formHorario.scrollIntoView({ behavior: 'smooth' });
    }

    function eliminarClase(dia, claseId) {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar esta clase del ${dia}?`)) {
            return;
        }

        estado.horario[dia] = (estado.horario[dia] || []).filter(c => c.id !== claseId);

        guardar();
        renderizarAdminHorario();
        renderizarHorario(); 
        console.log('Clase eliminada.');
    }

    function guardarClase(e) {
        e.preventDefault();

        const id = document.getElementById('claseId').value;
        const dia = document.getElementById('claseDia').value;
        const nombre = document.getElementById('claseNombre').value;
        const tipo = document.getElementById('claseTipo').value;
        const inicio = document.getElementById('claseInicio').value;
        const fin = document.getElementById('claseFin').value;
        
        const nuevaClase = {
            id: id || generarId(),
            nombre: nombre,
            hora: formatHora(inicio, fin), 
            horaInicio: inicio,
            horaFin: fin,
            tipo: tipo || undefined 
        };

        // Si es edición, eliminar la clase antigua (puede haber cambiado de día)
        if (id) {
            const dias = Object.keys(estado.horario);
            dias.forEach(d => {
                estado.horario[d] = (estado.horario[d] || []).filter(c => c.id !== id);
            });
        }

        // Añadir la nueva clase al día seleccionado
        if (!estado.horario[dia]) {
            estado.horario[dia] = [];
        }
        estado.horario[dia].push(nuevaClase);

        // Limpiar formulario y guardar
        ui.formHorario.reset();
        document.getElementById('claseId').value = '';
        ui.btnCancelarEdicionHorario.style.display = 'none';
        
        guardar();
        renderizarAdminHorario();
        renderizarHorario(); 
        alert('Clase guardada con éxito.');
    }
    
    ui.formHorario.addEventListener('submit', guardarClase);
    ui.btnCancelarEdicionHorario.addEventListener('click', () => {
        ui.formHorario.reset();
        document.getElementById('claseId').value = '';
        ui.btnCancelarEdicionHorario.style.display = 'none';
    });


    // --- RENDERIZADO TIENDA (SIN CAMBIOS) ---
    function renderizarTienda() {
        ui.contenedorPremios.innerHTML = '';
        const today = new Date().getDay(); 
        const isWeekend = today === 0 || today === 6;
        
        const storeMessage = document.getElementById('storeMessage');
        const storeMessageTitle = document.getElementById('storeMessageTitle');
        const storeMessageBody = document.getElementById('storeMessageBody');

        if (isWeekend) {
            storeMessage.classList.add('bg-yellow-100', 'border-yellow-300', 'text-yellow-800');
            storeMessage.classList.remove('bg-gray-100', 'border-gray-300', 'text-gray-800');
            storeMessageTitle.textContent = "¡Es Fin de Semana! 🎉";
            storeMessageBody.textContent = "Puedes usar tus Minutos para Premios de Tiempo sin restricciones.";
        } else {
            storeMessage.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-800');
            storeMessage.classList.remove('bg-yellow-100', 'border-yellow-300', 'text-yellow-800');
            storeMessageTitle.textContent = "Regla de la Semana";
            storeMessageBody.textContent = "Los Premios de Tiempo (Minutos) se pueden reclamar, ¡pero solo para el Fin de Semana!";
        }
        
        catalogoPremios.forEach(premio => {
            const card = document.createElement('div');
            card.className = 'premio-card';
            card.innerHTML = `
                <div class="premio-icono">${premio.icono}</div>
                <div class="font-bold text-lg text-gray-800 mb-1">${premio.nombre}</div>
                <div class="price-tag">
                    ${premio.coste} ${premio.moneda === 'puntos' ? 'Pts ⭐' : 'Min ⏱️'}
                </div>
            `;
            
            card.addEventListener('click', () => {
                if (premio.moneda === 'puntos') {
                    if (estado.puntos >= premio.coste) {
                        if (window.confirm(`¿Comprar ${premio.nombre} por ${premio.coste} Pts?`)) {
                            estado.puntos -= premio.coste;
                            reproducir('caja');
                            guardar();
                            alert(`¡Has comprado ${premio.nombre}! Recompensa entregada.`);
                        }
                    } else {
                        alert(`Puntos insuficientes. Necesitas ${premio.coste} Pts.`);
                        reproducir('error');
                    }
                } else if (premio.moneda === 'minutos') {
                    if (estado.minutos >= premio.coste) {
                        if (!isWeekend && new Date().getDay() !== 5) { // Si no es viernes o fin de semana
                            alert("Recuerda: solo puedes usar los minutos para premios de tiempo durante el Fin de Semana.");
                        }
                        if (window.confirm(`¿Usar ${premio.coste} Minutos para ${premio.nombre}?`)) {
                            estado.minutos -= premio.coste;
                            reproducir('caja');
                            guardar();
                            alert(`¡Has usado ${premio.coste} minutos para ${premio.nombre}! Tiempo de uso anotado.`);
                        }
                    } else {
                        alert(`Minutos insuficientes. Necesitas ${premio.coste} Min.`);
                        reproducir('error');
                    }
                }
            });
            
            ui.contenedorPremios.appendChild(card);
        });
    }

    // --- RENDERIZADO AGENDA (SIN CAMBIOS) ---
    function renderizarAgenda() {
        ui.listaEventos.innerHTML = '';
        
        // ... (Lógica de Agenda sin cambios) ...
    }
    
    // Lógica Agenda CRUD (guardarEvento, cargarEventoParaEdicion, eliminarEvento) sin cambios
    
    function guardarEvento(e) {
        e.preventDefault();
        // ... (lógica sin cambios) ...
        const id = document.getElementById('agendaId').value;
        // ... (resto de la lógica) ...
    }
    
    // ... (cargarEventoParaEdicion, eliminarEvento) ...


    // --- RENDERIZADO INFORME SEMANAL (SIN CAMBIOS) ---
    function renderizarInforme() {
        // ... (Lógica de Informe sin cambios) ...
        // ...
        ui.detalleSemanal.innerHTML = '';
        
        const hoyResumen = generarResumenDiario(estado.tareasHoy, 'Hoy');
        
        const historialCompleto = [hoyResumen, ...estado.historialSemanal];
        
        let compTot = 0, failTot = 0, ptsTot = 0, minTot = 0;
        
        historialCompleto.forEach(dia => {
            compTot += dia.completadas;
            failTot += dia.fallidas;
            ptsTot += dia.puntos;
            minTot += dia.minutos;
            
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

        // Actualizar totales
        ui.compTot.textContent = compTot;
        ui.failTot.textContent = failTot;
        ui.ptsTot.textContent = ptsTot;
        ui.minTot.textContent = minTot;
    }

    // --- 7. GESTIÓN DE VISTAS (NAVEGACIÓN) ---
    // Inicializar la UI al cargar
    actualizarUI();
    renderizarTareas(); 
    
    ui.btnHome.addEventListener('click', () => {
        mostrarVista('vistaTareas', ui.btnHome);
        renderizarTareas();
    });

    ui.btnShop.addEventListener('click', () => {
        mostrarVista('vistaTienda', ui.btnShop);
        renderizarTienda();
    });

    ui.btnSchedule.addEventListener('click', () => {
        mostrarVista('vistaHorario', ui.btnSchedule);
        renderizarHorario();
    });
    
    // Listener para la NUEVA VISTA de Administración de Horario
    ui.btnAdminHorario.addEventListener('click', () => { 
        mostrarVista('vistaAdminHorario'); 
        renderizarAdminHorario();
    });

    ui.btnAgenda.addEventListener('click', () => { 
        mostrarVista('vistaAgenda', ui.btnAgenda);
        renderizarAgenda();
    });
    
    ui.btnReport.addEventListener('click', () => { 
        mostrarVista('vistaInforme', ui.btnReport);
        renderizarInforme(); 
    });
    
    ui.btnAdminTareas.addEventListener('click', () => { 
        mostrarVista('vistaAdminTareas'); 
        renderizarAdminTareas();
    });

    ui.formAgenda.addEventListener('submit', guardarEvento); 

    // --- 8. EVENTOS DE ACCIONES RÁPIDAS Y RESET ---
    ui.btnDiario.addEventListener('click', () => {
        const hoy = new Date().toDateString();
        if (estado.ultimoDiario === hoy) {
            console.log("Ya has recogido el premio diario de hoy. Vuelve mañana.");
            reproducir('error');
            alert("Ya has recogido tu regalo de hoy. ¡Vuelve mañana!");
            return;
        }

        estado.puntos += 10;
        estado.ultimoDiario = hoy; 
        reproducir('exito');
        guardar();
        alert("¡+10 Puntos recibidos! 🎁");
    });

    ui.btnSemanal.addEventListener('click', () => {
        if(window.confirm("¿Reclamar premio semanal (+70)?")) {
            estado.puntos += 70;
            reproducir('nivel');
            guardar();
        }
    });

    ui.btnReset.addEventListener('click', () => {
        if(window.confirm("⚠️ ¿BORRAR TODO? Se perderán puntos, nivel, agenda, historial, catálogo de tareas Y EL HORARIO personalizado.")) {
            localStorage.removeItem('shukudai_v3_data');
            localStorage.removeItem('shukudai_v3_default_tasks');
            localStorage.removeItem('shukudai_v3_horario'); // NUEVO: Eliminar el horario
            location.reload();
        }
    });

});
