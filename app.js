document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN ---
    // SHUKUDAI 3.0: Agenda + 5 Vistas en el Dock + Historial Semanal.
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

    // --- CATÁLOGO DE PREMIOS ---
    const catalogoPremios = [
        // Premios de Puntos
        { id: 'peli', nombre: 'Noche de Cine', icono: '🎬', coste: 250, moneda: 'puntos' },
        { id: 'helado', nombre: 'Comer Helado', icono: '🍦', coste: 120, moneda: 'puntos' },
        { id: 'parque', nombre: 'Ir al Parque', icono: '🛝', coste: 200, moneda: 'puntos' },
        { id: 'pizza', nombre: 'Cena Pizza', icono: '🍕', coste: 200, moneda: 'puntos' },
        // Premios de Minutos (Tiempo de Pantalla)
        { id: 'tablet', nombre: '30 min Tablet', icono: '📱', coste: 30, moneda: 'minutos' }, // 30 minutos
        { id: 'consola', nombre: '1 Hora Consola', icono: '🎮', coste: 60, moneda: 'minutos' }, // 60 minutos
        { id: 'movil', nombre: '1 Hora Móvil', icono: '🤳', coste: 60, moneda: 'minutos' }, // 60 minutos
        { id: 'ordenador', nombre: '1 Hora Ordenador', icono: '💻', coste: 60, moneda: 'minutos' }, // 60 minutos
    ];

    // --- 2. ESTADO Y PERSISTENCIA (USANDO LOCALSTORAGE) ---
    // Versión 3.0: Añadimos historialSemanal y fechaInicioSemana
    let estado = JSON.parse(localStorage.getItem('shukudai_v3_data')) || {
        puntos: 0,
        minutos: 0,
        nivel: 1,
        tareasHoy: {},
        agendaEventos: [], 
        ultimaFecha: new Date().toDateString(),
        ultimoDiario: null,
        historialSemanal: [], // NUEVO: Almacena resúmenes de días pasados
        fechaInicioSemana: new Date().toDateString() // NUEVO: Para saber cuándo empezó el ciclo de informe
    };

    // --- 3. LÓGICA DE NUEVO DÍA Y ARCHIVO SEMANAL ---
    
    // Función auxiliar para obtener los resultados de un día específico
    function generarResumenDiario(tareas, fecha) {
        let completadas = 0;
        let fallidas = 0;
        let puntosObtenidos = 0;
        let minutosObtenidos = 0;
        
        const todasLasTareas = catalogoTareas.flatMap(c => c.items); 

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
        vistaInforme: document.getElementById('vistaInforme'), // NUEVO
        btnHome: document.getElementById('homeBtn'),
        btnShop: document.getElementById('shopBtn'),
        btnSchedule: document.getElementById('scheduleBtn'),
        btnAgenda: document.getElementById('agendaBtn'), 
        btnReport: document.getElementById('reportBtn'), // NUEVO
        btnReset: document.getElementById('btnReset'),
        btnDiario: document.getElementById('btnPremioDiario'),
        btnSemanal: document.getElementById('btnPremioSemanal'),
        // Referencias para el informe
        totalStats: document.getElementById('totalStats'),
        detalleSemanal: document.getElementById('detalleSemanal'),
        compTot: document.getElementById('compTot'),
        failTot: document.getElementById('failTot'),
        ptsTot: document.getElementById('ptsTot'),
        minTot: document.getElementById('minTot')
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
    
    // Función para gestionar la navegación entre las 5 vistas
    function mostrarVista(vistaId, btnActivo) {
        const vistas = [ui.vistaTareas, ui.vistaTienda, ui.vistaHorario, ui.vistaAgenda, ui.vistaInforme];
        const botones = [ui.btnHome, ui.btnShop, ui.btnSchedule, ui.btnAgenda, ui.btnReport];

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

    function renderizarTienda() {
        ui.contenedorPremios.innerHTML = '';
        
        // Lógica de verificación de fin de semana para el mensaje
        const today = new Date().getDay(); // 0 = Domingo, 6 = Sábado
        const isWeekend = today === 0 || today === 6;

        const messageDiv = document.getElementById('storeMessage');
        const messageTitle = document.getElementById('storeMessageTitle');
        const messageBody = document.getElementById('storeMessageBody');

        if (isWeekend) {
            messageDiv.className = 'mb-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded-lg text-center';
            messageTitle.textContent = '¡HOY ES FIN DE SEMANA! 🎉';
            messageBody.textContent = '¡Ya puedes canjear tus premios! ¡Felicidades por tu esfuerzo!';
        } else {
            messageDiv.className = 'mb-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg text-center';
            messageTitle.textContent = 'Canje de Premios: ¡SÓLO FINES DE SEMANA! 📅';
            messageBody.textContent = 'Aún no es momento de canjear. Sigue acumulando puntos y minutos para el Sábado y Domingo.';
        }


        catalogoPremios.forEach(premio => {
            
            const monedaSimbolo = premio.moneda === 'minutos' ? 'min' : 'pts';
            const cantidadDisponible = premio.moneda === 'minutos' ? estado.minutos : estado.puntos;

            const puedeComprar = cantidadDisponible >= premio.coste;
            
            const card = document.createElement('div');
            card.className = 'premio-card';
            // Opacidad reducida si no puede comprar O si no es fin de semana.
            card.style.opacity = (puedeComprar && isWeekend) ? '1' : '0.5';

            card.innerHTML = `
                <div class="premio-icono">${premio.icono}</div>
                <div style="font-weight:bold;">${premio.nombre}</div>
                <div class="price-tag">${premio.coste} ${monedaSimbolo}</div>
            `;

            card.addEventListener('click', () => {
                // Verificar si es fin de semana y si puede comprar
                if (!isWeekend) {
                    reproducir('error');
                    console.log("Solo se puede canjear premios los fines de semana.");
                    alert("Solo se puede canjear premios los fines de semana. ¡Sigue esforzándote!");
                    return;
                }

                if (!puedeComprar) {
                    reproducir('error');
                    const faltante = premio.coste - cantidadDisponible;
                    alert(`Te faltan ${faltante} ${monedaSimbolo}. ¡Sigue acumulando!`); 
                    return;
                }
                
                // Usamos confirm() para simular un modal
                if (window.confirm(`¿Comprar "${premio.nombre}" por ${premio.coste} ${monedaSimbolo}?`)) {
                    // Lógica de DEDUCCIÓN
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

    // --- RENDERIZADO AGENDA ---
    function renderizarAgenda() {
        ui.listaEventos.innerHTML = '';
        
        // Ordenar eventos por fecha ascendente
        const eventosOrdenados = [...estado.agendaEventos].sort((a, b) => 
            new Date(a.fecha + ' ' + (a.hora || '00:00')) - new Date(b.fecha + ' ' + (b.hora || '00:00'))
        );

        if (eventosOrdenados.length === 0) {
            ui.listaEventos.innerHTML = '<p class="text-gray-500 text-center py-4">No hay eventos próximos en la agenda.</p>';
            return;
        }

        eventosOrdenados.forEach(evento => {
            const card = document.createElement('div');
            // Añade una clase para estilizar según el tipo
            let tipoClase = evento.tipo.toLowerCase().replace(/\s/g, ''); 
            // Fallback si no coincide exactamente
            if (!['examen', 'cita', 'entrega'].includes(tipoClase)) tipoClase = 'otro';
            
            card.className = `agenda-card ${tipoClase}`;

            card.innerHTML = `
                <div class="agenda-title">${evento.tipo} de ${evento.asignatura}</div>
                <div class="agenda-info-row">
                    <span>${new Date(evento.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span>${evento.hora || ''}</span>
                </div>
                ${evento.comentarios ? `<p class="agenda-comments">${evento.comentarios}</p>` : ''}
                <div class="agenda-actions">
                    <button class="btn-edit" data-id="${evento.id}">📝 Editar</button>
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

    // --- RENDERIZADO INFORME SEMANAL (NUEVO) ---
    function renderizarInforme() {
        // 1. Calcular Totales
        let totalCompletadas = 0;
        let totalFallidas = 0;
        let totalPuntos = 0;
        let totalMinutos = 0;

        estado.historialSemanal.forEach(dia => {
            totalCompletadas += dia.completadas;
            totalFallidas += dia.fallidas;
            totalPuntos += dia.puntos;
            totalMinutos += dia.minutos;
        });
        
        // Incluir el resumen del día actual
        const hoyResumen = generarResumenDiario(estado.tareasHoy, "Hoy");
        totalCompletadas += hoyResumen.completadas;
        totalFallidas += hoyResumen.fallidas;
        totalPuntos += hoyResumen.puntos;
        totalMinutos += hoyResumen.minutos;
        
        // 2. Renderizar Totales
        ui.compTot.textContent = totalCompletadas;
        ui.failTot.textContent = totalFallidas;
        ui.ptsTot.textContent = totalPuntos;
        ui.minTot.textContent = totalMinutos;
        
        // 3. Renderizar Detalle Diario
        ui.detalleSemanal.innerHTML = '';
        
        const historialCompleto = [hoyResumen, ...estado.historialSemanal].reverse(); // De más reciente a más antiguo
        
        const diasMostrados = historialCompleto.filter(dia => dia.completadas > 0 || dia.fallidas > 0);

        if (diasMostrados.length === 0) {
            ui.detalleSemanal.innerHTML = '<p class="text-gray-500 text-center py-4">Aún no hay días archivados o con tareas realizadas en este ciclo semanal.</p>';
            return;
        }

        diasMostrados.forEach(dia => {
            const card = document.createElement('div');
            card.className = 'p-3 bg-white border border-gray-200 rounded-lg shadow-sm';
            
            const fechaFormateada = dia.fecha === 'Hoy' 
                ? 'Hoy' 
                : new Date(dia.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
                
            card.innerHTML = `
                <div class="font-bold text-lg text-gray-800">${fechaFormateada}</div>
                <div class="text-sm mt-1">
                    <p class="text-green-700">✅ Hechas: **${dia.completadas}**</p>
                    <p class="text-red-700">❌ Falladas: **${dia.fallidas}**</p>
                    <p class="mt-2 text-indigo-600">Recompensa: **+${dia.puntos} Pts / +${dia.minutos} Min**</p>
                </div>
            `;
            ui.detalleSemanal.appendChild(card);
        });
    }

    // --- LÓGICA AGENDA CRUD ---

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
        
        // Mover la vista a la Agenda y hacer scroll al formulario
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
        if (window.confirm('¿Seguro que quieres eliminar este evento de la agenda?')) {
            estado.agendaEventos = estado.agendaEventos.filter(e => e.id !== id);
            guardar();
            renderizarAgenda();
            console.log('Evento eliminado.'); // **DEPURADO: Ya no reproduce el audio de error**
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
    
    ui.btnReport.addEventListener('click', () => { // NUEVO
        mostrarVista('vistaInforme', ui.btnReport);
        renderizarInforme(); 
    });

    ui.formAgenda.addEventListener('submit', guardarEvento); 

    // --- 9. EVENTOS DE ACCIONES RÁPIDAS Y RESET ---
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
        if(window.confirm("⚠️ ¿BORRAR TODO? Se perderán puntos, nivel, agenda e historial.")) {
            localStorage.removeItem('shukudai_v3_data');
            location.reload();
        }
    });

    // INICIO: Mostrar la vista de tareas por defecto al cargar.
    mostrarVista('vistaTareas', ui.btnHome);
    actualizarUI();
});
