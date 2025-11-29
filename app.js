document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN ---
    // SHUKUDAI 3.1: Tareas personalizables (Admin CRUD)
    const META_XP = 125; 
    
    // Sonidos (URLs estables de Google CDN)
    const SONIDOS = {
        exito: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
        nivel: new Audio('https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'),
        error: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
        caja: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg')
    };

    // --- HORARIO SEMANAL COMPLETO (SIN CAMBIOS) ---
    const horarioSemanal = {
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
    const DEFAULT_CATALOGO_TAREAS = [ // CAMBIADO NOMBRE
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

    // --- 2. ESTADO Y PERSISTENCIA (USANDO LOCALSTORAGE) ---
    // Versión 3.1: Añade catalogoTareas a la persistencia
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
        // NUEVO: Catálogo de tareas persistente. Se inicializa con el catálogo por defecto.
        catalogoTareas: JSON.parse(localStorage.getItem('shukudai_v3_default_tasks')) || DEFAULT_CATALOGO_TAREAS 
    };
    
    // Asegurar que las tareas por defecto se guarden si no existen (Migración 3.1)
    if (!localStorage.getItem('shukudai_v3_default_tasks')) {
        localStorage.setItem('shukudai_v3_default_tasks', JSON.stringify(DEFAULT_CATALOGO_TAREAS));
    }


    // --- 3. LÓGICA DE NUEVO DÍA Y ARCHIVO SEMANAL ---
    
    // Función auxiliar para obtener los resultados de un día específico
    function generarResumenDiario(tareas, fecha) {
        let completadas = 0;
        let fallidas = 0;
        let puntosObtenidos = 0;
        let minutosObtenidos = 0;
        
        // **IMPORTANTE:** Usa estado.catalogoTareas
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
    
    // Función para manejar el reinicio del ciclo semanal
    function limpiarHistorialSiAplica() {
        const inicio = new Date(estado.fechaInicioSemana);
        const hoy = new Date();
        const diffTime = Math.abs(hoy - inicio);
        // Calcula días de diferencia.
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        // Reinicia el historial y la fecha de inicio de semana si han pasado 7 días.
        if (diffDays >= 7) { 
            console.log("Reiniciando ciclo semanal de informe.");
            estado.historialSemanal = []; 
            estado.fechaInicioSemana = new Date().toDateString();
        }
    }


    const hoy = new Date().toDateString();
    if (estado.ultimaFecha !== hoy) {
        console.log("¡Nuevo día detectado! Archivando tareas de ayer...");
        
        // 1. Archivar el resumen del día anterior (ultimaFecha)
        const ayer = estado.ultimaFecha;
        const resumenAyer = generarResumenDiario(estado.tareasHoy, ayer);
        
        // Solo archivar si se realizaron tareas
        if (resumenAyer.completadas > 0 || resumenAyer.fallidas > 0) {
             estado.historialSemanal.push(resumenAyer);
        }
        
        // 2. Limpiar el historial si ha pasado una semana
        limpiarHistorialSiAplica(); 
        
        // 3. Resetear para el nuevo día
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
        vistaAdminTareas: document.getElementById('vistaAdminTareas'), // NUEVA VISTA
        
        btnHome: document.getElementById('homeBtn'),
        btnShop: document.getElementById('shopBtn'),
        btnSchedule: document.getElementById('scheduleBtn'),
        btnAgenda: document.getElementById('agendaBtn'),
        btnReport: document.getElementById('reportBtn'), 
        btnAdminTareas: document.getElementById('btnAdminTareas'), // NUEVO BOTÓN
        
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
        btnCancelarEdicion: document.getElementById('btnCancelarEdicion')
    };
    
    // --- 5. FUNCIONES DE UTILIDAD ---
    
    function guardar() {
        localStorage.setItem('shukudai_v3_data', JSON.stringify(estado));
        // Guardar el catálogo de tareas por separado para facilitar la migración futura
        localStorage.setItem('shukudai_v3_default_tasks', JSON.stringify(estado.catalogoTareas));
        actualizarUI(); // Asegura que la UI se refresque después de guardar
    }
    
    function generarId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    
    function actualizarUI() {
        // Actualizar Marcador
        ui.puntos.textContent = estado.puntos;
        ui.minutos.textContent = estado.minutos;
        
        // Actualizar Nivel y XP
        ui.nivel.textContent = estado.nivel;
        
        const xpActual = estado.puntos % META_XP;
        const porcentajeXP = (xpActual / META_XP) * 100;
        
        ui.xpFill.style.width = `${porcentajeXP}%`;
        ui.xpTexto.textContent = `${xpActual} / ${META_XP} xp`;
        
        // Verificar Nivel
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
    
    // Función para gestionar la navegación entre las 6 vistas
    function mostrarVista(vistaId, btnActivo = null) {
        // Incluir la nueva vista
        const vistas = [ui.vistaTareas, ui.vistaTienda, ui.vistaHorario, ui.vistaAgenda, ui.vistaInforme, ui.vistaAdminTareas]; 
        const botones = [ui.btnHome, ui.btnShop, ui.btnSchedule, ui.btnAgenda, ui.btnReport]; // El botón Admin no está en el dock
        
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
        // **IMPORTANTE:** Usar estado.catalogoTareas en lugar de la constante
        estado.catalogoTareas.forEach(grupo => {
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

    // --- RENDERIZADO ADMIN TAREAS (NUEVO) ---
    function renderizarAdminTareas() {
        ui.listaTareasAdmin.innerHTML = '';
        
        // 1. Rellenar el selector de categorías en el formulario
        const selectCategoria = document.getElementById('tareaCategoria');
        selectCategoria.innerHTML = estado.catalogoTareas.map(c => 
            `<option value="${c.categoria}">${c.categoria.split(' ')[0]}</option>`
        ).join('');

        // 2. Renderizar la lista de tareas con botones de acción
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
                
                // Asignar listeners a los botones
                card.querySelector('.btn-edit').addEventListener('click', (e) => 
                    cargarTareaParaEdicion(e.target.dataset.category, e.target.dataset.id)
                );
                card.querySelector('.btn-delete').addEventListener('click', (e) => 
                    eliminarTarea(e.target.dataset.category, e.target.dataset.id)
                );

                ui.listaTareasAdmin.appendChild(card);
            });
        });
        
        // Si no hay tareas, mostrar un mensaje
        if (estado.catalogoTareas.every(c => c.items.length === 0)) {
            ui.listaTareasAdmin.innerHTML = '<p style="color: #999; text-align: center; padding: 15px;">No hay tareas en el catálogo. ¡Añade una!</p>';
        }
    }
    
    // --- LÓGICA CRUD TAREAS (NUEVO) ---
    function cargarTareaParaEdicion(categoriaNombre, itemId) {
        const categoria = estado.catalogoTareas.find(c => c.categoria === categoriaNombre);
        const tarea = categoria ? categoria.items.find(t => t.id === itemId) : null;
        if (!tarea) return;

        // Cargar datos en el formulario
        document.getElementById('tareaId').value = tarea.id;
        document.getElementById('tareaCategoriaOriginal').value = categoriaNombre; // Guardar la categoría original
        document.getElementById('tareaNombre').value = tarea.nombre;
        document.getElementById('tareaPts').value = tarea.pts;
        document.getElementById('tareaMin').value = tarea.min;
        
        // Seleccionar la categoría
        document.getElementById('tareaCategoria').value = categoriaNombre;
        
        // Mostrar botón de cancelar edición
        ui.btnCancelarEdicion.style.display = 'block';
        
        // Enfocar en el formulario
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
            renderizarTareas(); // Refrescar la vista principal
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

        // 1. Eliminar tarea de la categoría original (si existe y es edición)
        if (id && categoriaOriginal) {
            const catOriginalIndex = estado.catalogoTareas.findIndex(c => c.categoria === categoriaOriginal);
            if (catOriginalIndex !== -1) {
                estado.catalogoTareas[catOriginalIndex].items = 
                    estado.catalogoTareas[catOriginalIndex].items.filter(t => t.id !== id);
            }
        }
        
        // 2. Añadir/Actualizar tarea en la nueva categoría
        const catNuevaIndex = estado.catalogoTareas.findIndex(c => c.categoria === categoriaNueva);
        if (catNuevaIndex !== -1) {
            // Si la tarea existía y la categoría es la misma (actualización simple)
            // Ya se manejó la eliminación arriba, así que solo la añadimos.
            estado.catalogoTareas[catNuevaIndex].items.push(nuevaTarea);
        } else {
            // Si la categoría no existe (Esto no debería pasar con el selector, pero por seguridad)
            estado.catalogoTareas.push({ categoria: categoriaNueva, items: [nuevaTarea] });
        }

        // Limpiar formulario y guardar
        ui.formTarea.reset();
        document.getElementById('tareaId').value = '';
        document.getElementById('tareaCategoriaOriginal').value = '';
        ui.btnCancelarEdicion.style.display = 'none';
        
        guardar();
        renderizarAdminTareas();
        renderizarTareas(); // Refrescar la vista principal
        alert('Tarea guardada con éxito.');
    }
    
    ui.formTarea.addEventListener('submit', guardarTarea);
    ui.btnCancelarEdicion.addEventListener('click', () => {
        ui.formTarea.reset();
        document.getElementById('tareaId').value = '';
        document.getElementById('tareaCategoriaOriginal').value = '';
        ui.btnCancelarEdicion.style.display = 'none';
    });


    // --- 7. ACCIONES DE TAREAS (SIN CAMBIOS EN LÓGICA) --- 
    function completarTarea(tarea, exito) {
        if (exito) {
            estado.puntos += tarea.pts;
            estado.minutos += tarea.min;
            estado.tareasHoy[tarea.id] = 'hecho';
            reproducir('exito');
        } else {
            estado.tareasHoy[tarea.id] = 'fail';
            reproducir('error');
        }
        guardar();
        renderizarTareas();
    }

    // --- RENDERIZADO TIENDA (SIN CAMBIOS) ---
    function renderizarTienda() {
        ui.contenedorPremios.innerHTML = '';
        const today = new Date().getDay(); 
        const isWeekend = today === 0 || today === 6;
        // ... (rest of renderizarTienda function is omitted for brevity, assumes it's unchanged) ...
        
        // ...
        catalogoPremios.forEach(premio => {
            // ...
            card.addEventListener('click', () => {
                // ... (logic remains the same) ...
            });
            
            ui.contenedorPremios.appendChild(card);
        });
    }

    // --- RENDERIZADO HORARIO (SIN CAMBIOS) ---
    function renderizarHorario() {
        // ... (function is omitted for brevity, assumes it's unchanged) ...
        ui.contenedorHorario.innerHTML = '';
        const dias = Object.keys(horarioSemanal);
        
        dias.forEach(dia => {
            const diaDiv = document.createElement('div');
            // ...
            ui.contenedorHorario.appendChild(diaDiv);
        });
    }
    
    // --- RENDERIZADO AGENDA (SIN CAMBIOS) ---
    function renderizarAgenda() {
        // ... (function is omitted for brevity, assumes it's unchanged) ...
        ui.listaEventos.innerHTML = '';
        
        // ... (logic remains the same) ...
    }
    // Lógica Agenda CRUD (guardarEvento, cargarEventoParaEdicion, eliminarEvento) sin cambios

    // --- RENDERIZADO INFORME SEMANAL (SIN CAMBIOS EN LÓGICA) ---
    function renderizarInforme() {
        // ... (function is omitted for brevity, assumes it's unchanged) ...
        // ...
        // **IMPORTANTE:** Usa estado.catalogoTareas en la llamada a generarResumenDiario
        const hoyResumen = generarResumenDiario(estado.tareasHoy, 'Hoy');
        // ...
    }

    // --- 8. GESTIÓN DE VISTAS (NAVEGACIÓN) ---
    // Inicializar la UI al cargar
    actualizarUI();
    renderizarTareas(); // Mostrar la vista de Tareas por defecto
    
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

    ui.btnAgenda.addEventListener('click', () => { 
        mostrarVista('vistaAgenda', ui.btnAgenda);
        renderizarAgenda();
    });
    
    ui.btnReport.addEventListener('click', () => { 
        mostrarVista('vistaInforme', ui.btnReport);
        renderizarInforme(); 
    });
    
    // Listener para la NUEVA VISTA de Administración de Tareas
    ui.btnAdminTareas.addEventListener('click', () => { 
        mostrarVista('vistaAdminTareas'); // No hay botón activo en el dock
        renderizarAdminTareas();
    });

    ui.formAgenda.addEventListener('submit', guardarEvento); 
    // Los listeners de formTarea y btnCancelarEdicion se añadieron arriba.

    // --- 9. EVENTOS DE ACCIONES RÁPIDAS Y RESET (SIN CAMBIOS) ---
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
        if(window.confirm("⚠️ ¿BORRAR TODO? Se perderán puntos, nivel, agenda, historial Y EL CATÁLOGO DE TAREAS PERSONALIZADO.")) {
            localStorage.removeItem('shukudai_v3_data');
            localStorage.removeItem('shukudai_v3_default_tasks'); // Eliminar también las tareas personalizadas
            location.reload();
        }
    });

});
