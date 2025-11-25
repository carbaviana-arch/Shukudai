document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN ---
    // SHUKUDAI 2.6: Agenda y 4 Vistas en el Dock.
    const META_XP = 125; 
    
    // Sonidos (URLs estables de Google CDN)
    const SONIDOS = {
        exito: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
        nivel: new Audio('https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'),
        error: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
        caja: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg')
    };

    // --- HORARIO SEMANAL COMPLETO ---
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
    
    // --- LISTADO DE TAREAS ---
    const catalogoTareas = [
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

    // --- CATÁLOGO DE PREMIOS ACTUALIZADO: AÑADIMOS PROPIEDAD 'moneda' ---
    const catalogoPremios = [
        // Premios de Puntos
        { id: 'peli', nombre: 'Noche de Cine', icono: '🎬', coste: 250, moneda: 'puntos' },
        { id: 'helado', nombre: 'Comer Helado', icono: '🍦', coste: 120, moneda: 'puntos' },
        { id: 'parque', nombre: 'Ir al Parque', icono: '🛝', coste: 200, moneda: 'puntos' },
        { id: 'pizza', nombre: 'Cena Pizza', icono: '🍕', coste: 200, moneda: 'puntos' },
        // Premios de Minutos (Tiempo de Pantalla)
        // El coste ahora es en minutos, no en puntos.
        { id: 'tablet', nombre: '30 min Tablet', icono: '📱', coste: 30, moneda: 'minutos' }, // 30 minutos
        { id: 'consola', nombre: '1 Hora Consola', icono: '🎮', coste: 60, moneda: 'minutos' }, // 60 minutos
        { id: 'movil', nombre: '1 Hora Móvil', icono: '🤳', coste: 60, moneda: 'minutos' }, // 60 minutos
        { id: 'ordenador', nombre: '1 Hora Ordenador', icono: '💻', coste: 60, moneda: 'minutos' }, // 60 minutos
    ];

    // --- 2. ESTADO Y PERSISTENCIA (USANDO LOCALSTORAGE POR SIMPLICIDAD) ---
    // Incluimos agendaEventos en el estado
    let estado = JSON.parse(localStorage.getItem('shukudai_v3_data')) || {
        puntos: 0,
        minutos: 0,
        nivel: 1,
        tareasHoy: {},
        agendaEventos: [], 
        ultimaFecha: new Date().toDateString(),
        ultimoDiario: null,
    };

    // --- 3. LÓGICA DE NUEVO DÍA ---
    const hoy = new Date().toDateString();
    if (estado.ultimaFecha !== hoy) {
        console.log("¡Nuevo día detectado! Reseteando tareas.");
        estado.tareasHoy = {}; 
        estado.ultimaFecha = hoy;
        // No reseteamos el 'ultimoDiario' aquí, se maneja en el botón de premio.
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
        btnHome: document.getElementById('homeBtn'),
        btnShop: document.getElementById('shopBtn'),
        btnSchedule: document.getElementById('scheduleBtn'),
        btnAgenda: document.getElementById('agendaBtn'), 
        btnReset: document.getElementById('btnReset'),
        btnDiario: document.getElementById('btnPremioDiario'),
        btnSemanal: document.getElementById('btnPremioSemanal')
    };

    // --- 5. FUNCIONES CORE ---
    function guardar() {
        localStorage.setItem('shukudai_v3_data', JSON.stringify(estado));
        actualizarUI();
    }

    function actualizarUI() {
        // Textos
        ui.puntos.textContent = estado.puntos;
        ui.minutos.textContent = estado.minutos;
        ui.nivel.textContent = estado.nivel;
        
        // Barra XP
        const xpRestante = estado.puntos % META_XP;
        ui.xpFill.style.width = `${(xpRestante / META_XP) * 100}%`;
        ui.xpTexto.textContent = `${xpRestante} / ${META_XP} xp`;

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
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    }
    
    // Función para gestionar la navegación entre las 4 vistas
    function mostrarVista(vistaId, btnActivo) {
        const vistas = [ui.vistaTareas, ui.vistaTienda, ui.vistaHorario, ui.vistaAgenda];
        const botones = [ui.btnHome, ui.btnShop, ui.btnSchedule, ui.btnAgenda];

        vistas.forEach(v => v.style.display = 'none');
        botones.forEach(b => b.classList.remove('active'));

        document.getElementById(vistaId).style.display = 'block';
        btnActivo.classList.add('active');
    }

    // --- 6. RENDERIZADO DE VISTAS ---

    function renderizarTareas() {
        ui.contenedorCategorias.innerHTML = '';
        catalogoTareas.forEach(grupo => {
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
                        <button class="btn-circle check">✔</button>
                        <button class="btn-circle cross">✖</button>
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

    function renderizarTienda() {
        ui.contenedorPremios.innerHTML = '';
        catalogoPremios.forEach(premio => {
            
            const monedaSimbolo = premio.moneda === 'minutos' ? 'min' : 'pts';
            const cantidadDisponible = premio.moneda === 'minutos' ? estado.minutos : estado.puntos;

            const puedeComprar = cantidadDisponible >= premio.coste;
            
            const card = document.createElement('div');
            card.className = 'premio-card';
            card.style.opacity = puedeComprar ? '1' : '0.5';

            card.innerHTML = `
                <div class="premio-icono">${premio.icono}</div>
                <div style="font-weight:bold;">${premio.nombre}</div>
                <div class="price-tag">${premio.coste} ${monedaSimbolo}</div>
            `;

            card.addEventListener('click', () => {
                if (!puedeComprar) {
                    reproducir('error');
                    const faltante = premio.coste - cantidadDisponible;
                    console.log(`Te faltan ${faltante} ${monedaSimbolo}.`); 
                    return;
                }
                
                // Usamos confirm() temporalmente para simular un modal
                if (window.confirm(`¿Comprar "${premio.nombre}" por ${premio.coste} ${monedaSimbolo}?`)) {
                    // Lógica de DEDUCCIÓN ACTUALIZADA
                    if (premio.moneda === 'minutos') {
                        estado.minutos -= premio.coste;
                    } else {
                        estado.puntos -= premio.coste;
                    }

                    reproducir('caja');
                    lanzarConfeti(); 
                    guardar();
                    renderizarTienda(); 
                }
            });

            ui.contenedorPremios.appendChild(card);
        });
    }

    function renderizarHorario() {
        ui.contenedorHorario.innerHTML = '';
        const dias = Object.keys(horarioSemanal);
        
        dias.forEach(dia => {
            const diaDiv = document.createElement('div');
            diaDiv.className = 'horario-dia';

            const titulo = document.createElement('div');
            titulo.className = 'dia-titulo';
            titulo.textContent = dia;
            diaDiv.appendChild(titulo);

            horarioSemanal[dia].forEach(asignatura => {
                const asigDiv = document.createElement('div');
                // Añadimos una clase condicional para extraescolares
                asigDiv.className = `asignatura ${asignatura.tipo === 'extra' ? 'extra-curricular' : ''}`;
                asigDiv.innerHTML = `
                    <span class="asignatura-nombre">${asignatura.nombre}</span>
                    <span class="asignatura-hora">${asignatura.hora}</span>
                `;
                diaDiv.appendChild(asigDiv);
            });

            ui.contenedorHorario.appendChild(diaDiv);
        });
    }

    // --- RENDERIZADO AGENDA (NUEVO) ---
    function renderizarAgenda() {
        ui.listaEventos.innerHTML = '';
        
        // Ordenar eventos por fecha ascendente
        const eventosOrdenados = [...estado.agendaEventos].sort((a, b) => 
            new Date(a.fecha + ' ' + (a.hora || '00:00')) - new Date(b.fecha + ' ' + (b.hora || '00:00'))
        );

        if (eventosOrdenados.length === 0) {
            ui.listaEventos.innerHTML = '<p class="text-gray-500">No hay eventos próximos en la agenda.</p>';
            return;
        }

        eventosOrdenados.forEach(evento => {
            const card = document.createElement('div');
            // Añade una clase para estilizar según el tipo (e.g., examen, cita)
            let tipoClase = evento.tipo.toLowerCase().replace(/\s/g, ''); 
            card.className = `agenda-card ${tipoClase}`;

            card.innerHTML = `
                <div class="agenda-title">${evento.tipo} de ${evento.asignatura}</div>
                <div class="agenda-info-row">
                    <span>Fecha: ${new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>Hora: ${evento.hora || 'No especificada'}</span>
                </div>
                ${evento.comentarios ? `<p class="agenda-comments">${evento.comentarios}</p>` : ''}
                <div class="agenda-actions">
                    <button class="btn-edit btn-secondary" data-id="${evento.id}">📝 Editar</button>
                    <button class="btn-delete" data-id="${evento.id}">🗑️ Eliminar</button>
                </div>
            `;

            ui.listaEventos.appendChild(card);
        });

        // Añadir listeners para editar y eliminar
        ui.listaEventos.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => cargarEventoParaEdicion(e.target.dataset.id));
        });

        ui.listaEventos.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => eliminarEvento(e.target.dataset.id));
        });
    }

    // --- LÓGICA AGENDA CRUD (NUEVO) ---

    function generarId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function cargarEventoParaEdicion(id) {
        const evento = estado.agendaEventos.find(e => e.id === id);
        if (!evento) return;

        // Cargar datos en el formulario
        document.getElementById('agendaId').value = evento.id;
        document.getElementById('agendaFecha').value = evento.fecha;
        document.getElementById('agendaHora').value = evento.hora || '';
        document.getElementById('agendaAsignatura').value = evento.asignatura;
        document.getElementById('agendaTipo').value = evento.tipo;
        document.getElementById('agendaComentarios').value = evento.comentarios || '';
        
        // Mover la vista a la Agenda y hacer scroll al formulario (opcional pero útil)
        mostrarVista('vistaAgenda', ui.btnAgenda);
        ui.formAgenda.scrollIntoView({ behavior: 'smooth' });
    }

    function guardarEvento(e) {
        e.preventDefault();

        const id = document.getElementById('agendaId').value;
        const fecha = document.getElementById('agendaFecha').value;
        const hora = document.getElementById('agendaHora').value;
        const asignatura = document.getElementById('agendaAsignatura').value;
        const tipo = document.getElementById('agendaTipo').value;
        const comentarios = document.getElementById('agendaComentarios').value;

        const nuevoEvento = {
            id: id || generarId(),
            fecha,
            hora,
            asignatura,
            tipo,
            comentarios
        };

        if (id) {
            // Edición: Encontrar y reemplazar el evento existente
            const index = estado.agendaEventos.findIndex(e => e.id === id);
            if (index !== -1) {
                estado.agendaEventos[index] = nuevoEvento;
                console.log('Evento actualizado con éxito. 🎉');
            }
        } else {
            // Creación: Añadir nuevo evento
            estado.agendaEventos.push(nuevoEvento);
            console.log('Nuevo evento guardado. 🎉');
        }

        guardar();
        ui.formAgenda.reset(); // Limpiar formulario
        document.getElementById('agendaId').value = ''; // Resetear ID oculto
        renderizarAgenda();
    }

    function eliminarEvento(id) {
        // Usamos confirm() temporalmente para simular un modal
        if (window.confirm('¿Seguro que quieres eliminar este evento de la agenda?')) {
            estado.agendaEventos = estado.agendaEventos.filter(e => e.id !== id);
            guardar();
            renderizarAgenda();
            reproducir('error');
            console.log('Evento eliminado.');
        }
    }

    // --- 7. ACCIONES DE TAREAS ---
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

    // --- 8. EVENTOS GLOBALES DE NAVEGACIÓN ---
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

    ui.formAgenda.addEventListener('submit', guardarEvento); 

    // --- 9. EVENTOS DE ACCIONES RÁPIDAS Y RESET ---
    ui.btnDiario.addEventListener('click', () => {
        const hoy = new Date().toDateString();
        if (estado.ultimoDiario === hoy) {
            console.log("Ya has recogido el premio diario de hoy. Vuelve mañana.");
            reproducir('error');
            return;
        }

        estado.puntos += 10;
        estado.ultimoDiario = hoy; 
        reproducir('exito');
        guardar();
        console.log("+10 Puntos recibidos 🎁");
    });

    ui.btnSemanal.addEventListener('click', () => {
        // Usamos confirm() temporalmente para simular un modal
        if(window.confirm("¿Reclamar premio semanal (+70)?")) {
            estado.puntos += 70;
            reproducir('nivel');
            guardar();
        }
    });

    ui.btnReset.addEventListener('click', () => {
        // Usamos confirm() temporalmente para simular un modal
        if(window.confirm("⚠️ ¿BORRAR TODO? Se perderán puntos y nivel.")) {
            localStorage.removeItem('shukudai_v3_data');
            location.reload();
        }
    });

    // INICIO: Mostrar la vista de tareas por defecto al cargar.
    mostrarVista('vistaTareas', ui.btnHome);
    actualizarUI();
});
