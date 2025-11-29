document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN ---\
    const VERSION = "v4.0";
    const META_XP = 125; 
    
    // Sonidos (URLs estables de Google CDN)
    const SONIDOS = {
        exito: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
        nivel: new Audio('https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'),
        error: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
        caja: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg')
    };

    // --- ESTRUCTURA DE DATOS INICIALES ---\
    const tareasIniciales = {
        // Tareas por defecto
        Aseo: [
            { nombre: "Hacer la cama", pts: 5, min: 0, completado: false, fallido: false },
            { nombre: "Cepillarse los dientes (x3)", pts: 10, min: 0, completado: false, fallido: false },
        ],
        Académico: [
            { nombre: "Hacer deberes", pts: 20, min: 10, completado: false, fallido: false },
            { nombre: "Leer 15 minutos", pts: 10, min: 5, completado: false, fallido: false },
        ],
        Hogar: [
            { nombre: "Recoger juguetes", pts: 5, min: 0, completado: false, fallido: false },
            { nombre: "Poner la mesa", pts: 5, min: 0, completado: false, fallido: false },
        ],
        General: [
            { nombre: "Ser amable", pts: 10, min: 0, completado: false, fallido: false },
        ],
    };

    const premiosIniciales = [
        { nombre: "Ver la TV", pts: 0, min: 30, icono: "📺" },
        { nombre: "Tableta", pts: 0, min: 60, icono: "📱" },
        { nombre: "Jugar Consola", pts: 0, min: 45, icono: "🎮" },
        { nombre: "Cine/Pelicula", pts: 100, min: 0, icono: "🎬" },
        { nombre: "Juguete Pequeño", pts: 50, min: 0, icono: "🧸" },
        { nombre: "Salir al Parque", pts: 25, min: 0, icono: "🌳" }
    ];

    const horarioInicial = {
        Lunes: [
            { nombre: "Lengua", hora: "10:30 - 11:15" },
            { nombre: "Matemáticas", hora: "11:15 - 12:00" },
        ],
        Martes: [
            { nombre: "Sociales", hora: "10:30 - 11:15" },
        ],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
        Sábado: [],
        Domingo: [],
    };
    
    // Estado global de la aplicación
    let estado = {
        puntos: 0,
        minutos: 0,
        nivel: 1,
        xp: 0,
        ultimaFechaReset: new Date().toDateString(),
        ultimoDiario: null,
        tareas: tareasIniciales,
        premios: premiosIniciales,
        horario: horarioInicial,
        agenda: [],
        historial: [] // Para guardar eventos canjeados
    };

    // --- 2. REFERENCIAS A ELEMENTOS DEL DOM ---\
    const ui = {
        // Displays
        puntosDisplay: document.getElementById('puntosDisplay'),
        minutosDisplay: document.getElementById('minutosDisplay'),
        nivelDisplay: document.getElementById('nivelDisplay'),
        xpDisplay: document.getElementById('xpDisplay'),
        metaDisplay: document.getElementById('metaDisplay'),
        xpFill: document.getElementById('xpFill'),
        
        // Vistas
        vistas: document.querySelectorAll('.view'),
        vistaTareas: document.getElementById('vistaTareas'),
        vistaShop: document.getElementById('vistaShop'),
        vistaHorario: document.getElementById('vistaHorario'),
        vistaAgenda: document.getElementById('vistaAgenda'),
        vistaInforme: document.getElementById('vistaInforme'),

        // Dock
        dock: document.getElementById('dock'),
        btnTareas: document.getElementById('btnTareas'),
        btnShop: document.getElementById('btnShop'),
        btnSchedule: document.getElementById('btnSchedule'),
        btnAgenda: document.getElementById('btnAgenda'),
        btnReport: document.getElementById('btnReport'), // CORREGIDO: Usando ID correcto

        // Botones rápidos y Reset
        btnDiario: document.getElementById('btnDiario'),
        btnSemanal: document.getElementById('btnSemanal'),
        btnReset: document.getElementById('btnReset'),
        
        // Tareas
        listaTareas: document.getElementById('listaTareas'),

        // Tienda
        gridTienda: document.getElementById('gridTienda'),
        
        // Horario
        contenedorHorario: document.getElementById('contenedorHorario'),
        btnToggleHorarioForm: document.getElementById('btnToggleHorarioForm'),
        formHorario: document.getElementById('formHorario'),
        horarioNombre: document.getElementById('horarioNombre'),
        horarioHora: document.getElementById('horarioHora'),
        horarioDiaSelect: document.getElementById('horarioDiaSelect'),
        horarioIndex: document.getElementById('horarioIndex'),
        horarioDia: document.getElementById('horarioDia'),
        btnGuardarHorario: document.getElementById('btnGuardarHorario'),
        btnCancelarHorario: document.getElementById('btnCancelarHorario'),

        // Agenda
        contenedorAgenda: document.getElementById('contenedorAgenda'),
        formAgenda: document.getElementById('formAgenda'),
        eventoTitulo: document.getElementById('eventoTitulo'),
        eventoFecha: document.getElementById('eventoFecha'),
        eventoTipo: document.getElementById('eventoTipo'),
        eventoComentarios: document.getElementById('eventoComentarios'),
        btnGuardarEvento: document.getElementById('btnGuardarEvento'),
        
        // Informe
        detalleDiarioGrid: document.querySelector('.detalle-diario-grid')
    };
    
    // --- 3. FUNCIONES DE UTILIDAD ---\

    function guardar() {
        // Asegura que solo guardamos datos esenciales, no las funciones Audio.
        localStorage.setItem('shukudai_v3_data', JSON.stringify(estado));
        actualizarUI();
    }

    function cargar() {
        const data = localStorage.getItem('shukudai_v3_data');
        if (data) {
            // Carga el estado guardado, sobrescribiendo el estado inicial.
            Object.assign(estado, JSON.parse(data));
        }
        // Verificar y resetear tareas si es un nuevo día
        if (estado.ultimaFechaReset !== new Date().toDateString()) {
            resetearTareasDiarias();
            estado.ultimaFechaReset = new Date().toDateString();
            guardar();
        }
    }

    function reproducir(sonido) {
        if (SONIDOS[sonido]) {
            SONIDOS[sonido].play().catch(e => console.log("Error al reproducir sonido:", e));
        }
    }

    function actualizarUI() {
        // Marcador
        ui.puntosDisplay.textContent = `${estado.puntos} Pts`;
        ui.minutosDisplay.textContent = `${estado.minutos} Min`;
        
        // Nivel y XP
        const xpAcumulado = estado.puntos % META_XP;
        const nuevoNivel = 1 + Math.floor(estado.puntos / META_XP);

        ui.xpDisplay.textContent = xpAcumulado;
        ui.metaDisplay.textContent = META_XP;
        ui.xpFill.style.width = `${(xpAcumulado / META_XP) * 100}%`;
        
        if (nuevoNivel > estado.nivel) {
            estado.nivel = nuevoNivel;
            reproducir('nivel');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            alert(`¡Nivel Subido! Ahora eres Nivel ${estado.nivel}! 🎉`);
        }
        ui.nivelDisplay.textContent = estado.nivel;

        // Renderizar vistas actuales
        // Se llama solo a las funciones de la vista activa para evitar carga innecesaria
    }

    function mostrarVista(idVista, btnActivo) {
        // Ocultar todas las vistas
        ui.vistas.forEach(view => view.classList.add('hidden'));

        // Mostrar la vista seleccionada
        document.getElementById(idVista).classList.remove('hidden');

        // Actualizar el dock (clase active)
        ui.dock.querySelectorAll('.dock-item').forEach(btn => btn.classList.remove('active'));
        if (btnActivo) {
            btnActivo.classList.add('active');
        }
    }
    
    // --- 4. GESTIÓN DE TAREAS Y RESET ---\

    function resetearTareasDiarias() {
        // Recorrer todas las tareas y restaurar el estado
        for (const categoria in estado.tareas) {
            estado.tareas[categoria].forEach(tarea => {
                tarea.completado = false;
                tarea.fallido = false;
            });
        }
        console.log("Tareas reseteadas para el nuevo día.");
        guardar();
    }

    function renderizarTareas() {
        let html = '';
        for (const categoria in estado.tareas) {
            html += `
                <details open>
                    <summary>${categoria}</summary>
                    <div class="task-list">
            `;
            estado.tareas[categoria].forEach((tarea, index) => {
                const estadoClase = tarea.completado ? 'completed' : (tarea.fallido ? 'failed' : '');
                const disableButtons = tarea.completado || tarea.fallido ? 'disabled' : '';
                
                html += `
                    <div class="task ${estadoClase}" data-categoria="${categoria}" data-index="${index}">
                        <div class="task-info">
                            <span>${tarea.nombre}</span>
                            <span class="task-pts">${tarea.pts} Pts / ${tarea.min} Min</span>
                        </div>
                        <div class="task-buttons">
                            <button class="btn-circle check" data-action="complete" ${disableButtons}>✅</button>
                            <button class="btn-circle cross" data-action="fail" ${disableButtons}>❌</button>
                        </div>
                    </div>
                `;
            });
            html += '</div></details>';
        }
        ui.listaTareas.innerHTML = html;

        // Adjuntar listeners de eventos a los botones de tarea
        ui.listaTareas.querySelectorAll('.btn-circle').forEach(button => {
            button.addEventListener('click', manejarTareaClick);
        });
    }

    function manejarTareaClick(event) {
        const button = event.currentTarget;
        const taskDiv = button.closest('.task');
        const categoria = taskDiv.dataset.categoria;
        const index = parseInt(taskDiv.dataset.index);
        const action = button.dataset.action;

        const tarea = estado.tareas[categoria][index];
        
        if (tarea.completado || tarea.fallido) return; 

        if (action === 'complete') {
            tarea.completado = true;
            estado.puntos += tarea.pts;
            estado.minutos += tarea.min;
            reproducir('exito');
        } else if (action === 'fail') {
            tarea.fallido = true;
            reproducir('error');
        }
        
        guardar();
        renderizarTareas(); // Re-renderizar la lista para actualizar el estado visual
    }


    // --- 5. GESTIÓN DE TIENDA ---\

    function renderizarTienda() {
        const hoy = new Date();
        const esFinDeSemana = hoy.getDay() === 0 || hoy.getDay() === 6; // Domingo=0, Sábado=6
        
        let html = '';
        estado.premios.forEach((premio, index) => {
            let precioTexto;
            let precioValor;
            let esMinutos = premio.min > 0;

            if (esMinutos) {
                precioTexto = `${premio.min} Min`;
                precioValor = premio.min;
            } else {
                precioTexto = `${premio.pts} Pts`;
                precioValor = premio.pts;
            }
            
            const puedeCanjear = esFinDeSemana && (
                (esMinutos && estado.minutos >= precioValor) || 
                (!esMinutos && estado.puntos >= precioValor)
            );
            const disabled = puedeCanjear ? '' : 'disabled';
            const hoverClass = puedeCanjear ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed';

            html += `
                <div class="premio-card flex flex-col items-center p-4 border rounded-xl shadow-md ${hoverClass}">
                    <span class="premio-icono">${premio.icono}</span>
                    <h4 class="font-bold text-lg">${premio.nombre}</h4>
                    <div class="price-tag">${precioTexto}</div>
                    <button class="blue mt-3 px-3 py-1 text-sm rounded-lg font-bold" data-index="${index}" ${disabled}>
                        Canjear
                    </button>
                </div>
            `;
        });

        ui.gridTienda.innerHTML = html;
        
        // Adjuntar listeners de eventos a los botones de canje
        ui.gridTienda.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', manejarCanje);
        });

        // Mostrar un mensaje si no es fin de semana
        if (!esFinDeSemana) {
             ui.gridTienda.insertAdjacentHTML('beforebegin', '<p class="text-center text-red-500 font-semibold p-4">¡Espera al fin de semana para canjear!</p>');
        }
    }

    function manejarCanje(event) {
        const index = parseInt(event.currentTarget.dataset.index);
        const premio = estado.premios[index];

        let costo;
        let tipoCosto;

        if (premio.min > 0) {
            costo = premio.min;
            tipoCosto = 'Minutos';
        } else {
            costo = premio.pts;
            tipoCosto = 'Puntos';
        }

        if (window.confirm(`¿Quieres canjear ${premio.nombre} por ${costo} ${tipoCosto}?`)) {
            let suficiente = false;

            if (tipoCosto === 'Minutos' && estado.minutos >= costo) {
                estado.minutos -= costo;
                suficiente = true;
            } else if (tipoCosto === 'Puntos' && estado.puntos >= costo) {
                estado.puntos -= costo;
                suficiente = true;
            }

            if (suficiente) {
                reproducir('caja');
                // Agregar al historial (para el informe)
                estado.historial.unshift({
                    tipo: "Canje",
                    detalle: premio.nombre,
                    fecha: new Date().toLocaleDateString(),
                    costo: `${costo} ${tipoCosto}`
                });
                guardar();
                alert(`¡${premio.nombre} canjeado con éxito!`);
            } else {
                reproducir('error');
                alert(`No tienes suficientes ${tipoCosto}. Necesitas ${costo}.`);
            }
        }
        renderizarTienda(); // Actualiza la tienda para reflejar el nuevo saldo
    }


    // --- 6. GESTIÓN DE HORARIO (CRUD) ---\

    function renderizarHorario() {
        let html = '';
        const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

        diasSemana.forEach(dia => {
            const actividades = estado.horario[dia] || [];
            
            html += `
                <div class="horario-dia">
                    <div class="dia-titulo">${dia}</div>
                    <div class="actividades">
            `;
            
            if (actividades.length === 0) {
                html += '<div class="asignatura text-sm text-gray-500">No hay actividades.</div>';
            } else {
                actividades.forEach((actividad, index) => {
                    html += `
                        <div class="asignatura" data-dia="${dia}" data-index="${index}">
                            <div class="asignatura-nombre">${actividad.nombre}</div>
                            <div class="asignatura-hora flex items-center gap-2">
                                <span>${actividad.hora}</span>
                                <button class="text-sm text-blue-500 hover:text-blue-700 ml-2 btn-editar-horario" style="display:none;">📝</button>
                                <button class="text-sm text-red-500 hover:text-red-700 btn-eliminar-horario" style="display:none;">🗑️</button>
                            </div>
                        </div>
                    `;
                });
            }
            
            html += `
                    </div>
                </div>
            `;
        });
        
        ui.contenedorHorario.innerHTML = html;

        // Añadir listeners de CRUD si el formulario está visible (Modo Admin)
        if (!ui.formHorario.classList.contains('hidden')) {
            activarModoAdminHorario();
        }
    }

    function activarModoAdminHorario() {
        // Mostrar botones de Editar/Eliminar
        ui.contenedorHorario.querySelectorAll('.btn-editar-horario, .btn-eliminar-horario').forEach(btn => {
            btn.style.display = 'inline';
        });

        // Adjuntar listeners si no lo están
        ui.contenedorHorario.querySelectorAll('.btn-editar-horario').forEach(btn => {
            btn.onclick = (e) => editarActividad(e.currentTarget.closest('.asignatura'));
        });
        ui.contenedorHorario.querySelectorAll('.btn-eliminar-horario').forEach(btn => {
            btn.onclick = (e) => eliminarActividad(e.currentTarget.closest('.asignatura'));
        });
    }

    function editarActividad(element) {
        const dia = element.dataset.dia;
        const index = parseInt(element.dataset.index);
        const actividad = estado.horario[dia][index];

        // Rellenar el formulario
        ui.horarioIndex.value = index;
        ui.horarioDia.value = dia; 
        ui.horarioNombre.value = actividad.nombre;
        ui.horarioHora.value = actividad.hora;
        ui.horarioDiaSelect.value = dia; // Si se permite cambiar el día, seleccionar el día actual

        // Mostrar formulario (si estuviera oculto)
        ui.formHorario.classList.remove('hidden');
    }

    function eliminarActividad(element) {
        if (!confirm("¿Estás seguro de que quieres eliminar esta actividad?")) return;

        const dia = element.dataset.dia;
        const index = parseInt(element.dataset.index);
        
        estado.horario[dia].splice(index, 1);
        guardar();
        renderizarHorario();
    }

    function guardarActividad(event) {
        event.preventDefault();

        const index = ui.horarioIndex.value;
        const nombre = ui.horarioNombre.value.trim();
        const hora = ui.horarioHora.value.trim();
        const diaNuevo = ui.horarioDiaSelect.value;
        const diaAnterior = ui.horarioDia.value;

        if (!nombre || !hora || !diaNuevo) {
            alert("Por favor, rellena el nombre, hora y selecciona el día.");
            return;
        }

        const nuevaActividad = { nombre, hora };

        if (index !== "" && diaAnterior === diaNuevo) {
            // Modo Edición (mismo día)
            estado.horario[diaNuevo][parseInt(index)] = nuevaActividad;
        } else if (index !== "" && diaAnterior !== diaNuevo) {
            // Modo Edición (cambio de día)
            estado.horario[diaAnterior].splice(parseInt(index), 1); // Eliminar del día anterior
            estado.horario[diaNuevo].push(nuevaActividad); // Añadir al nuevo día
        } else {
            // Modo Creación
            estado.horario[diaNuevo] = estado.horario[diaNuevo] || []; // Asegurar que existe el array
            estado.horario[diaNuevo].push(nuevaActividad);
        }

        // Limpiar y ocultar formulario
        limpiarFormularioHorario();
        ui.formHorario.classList.add('hidden');
        guardar();
        renderizarHorario(); // Re-renderizar para ver los cambios
    }

    function limpiarFormularioHorario() {
        ui.horarioIndex.value = "";
        ui.horarioDia.value = "";
        ui.horarioNombre.value = "";
        ui.horarioHora.value = "";
        ui.horarioDiaSelect.value = "";
    }


    // --- 7. GESTIÓN DE AGENDA (CRUD) ---\

    function renderizarAgenda() {
        // Ordenar por fecha: Eventos más cercanos primero
        estado.agenda.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        let html = '';
        
        if (estado.agenda.length === 0) {
             html += '<p class="text-center text-gray-500 p-4">No hay eventos ni citas agendadas.</p>';
        }

        estado.agenda.forEach((evento, index) => {
            const tipoClase = evento.tipo === 'Examen' ? 'examen' : (evento.tipo === 'Cita' ? 'cita' : 'general');

            html += `
                <div class="agenda-card ${tipoClase}" data-index="${index}">
                    <div class="agenda-info-row">
                        <span>🗓️ ${evento.fecha}</span>
                        <span class="font-bold">${evento.tipo}</span>
                    </div>
                    <div class="agenda-title">${evento.titulo}</div>
                    ${evento.comentarios ? `<p class="agenda-comments">${evento.comentarios}</p>` : ''}
                    <div class="agenda-actions">
                        <button class="btn-edit" data-action="edit">Editar</button>
                        <button class="btn-delete" data-action="delete">Eliminar</button>
                    </div>
                </div>
            `;
        });

        ui.contenedorAgenda.innerHTML = html;
        
        // Adjuntar listeners de CRUD
        ui.contenedorAgenda.querySelectorAll('.agenda-card').forEach(card => {
            card.querySelector('.btn-edit').addEventListener('click', (e) => {
                const index = e.currentTarget.closest('.agenda-card').dataset.index;
                editarEvento(index);
            });
            card.querySelector('.btn-delete').addEventListener('click', (e) => {
                const index = e.currentTarget.closest('.agenda-card').dataset.index;
                eliminarEvento(index);
            });
        });

        // Asegurar que el formulario esté limpio y visible para añadir
        limpiarFormularioAgenda();
    }

    function limpiarFormularioAgenda() {
        ui.eventoId.value = '';
        ui.eventoTitulo.value = '';
        ui.eventoFecha.value = '';
        ui.eventoTipo.value = 'General';
        ui.eventoComentarios.value = '';
        ui.btnGuardarEvento.textContent = 'Guardar Evento';
    }

    function guardarEvento(event) {
        event.preventDefault();

        const id = ui.eventoId.value;
        const titulo = ui.eventoTitulo.value.trim();
        const fecha = ui.eventoFecha.value; // Formato YYYY-MM-DD
        const tipo = ui.eventoTipo.value;
        const comentarios = ui.eventoComentarios.value.trim();

        if (!titulo || !fecha) {
            alert("El título y la fecha son obligatorios.");
            return;
        }
        
        const nuevoEvento = { titulo, fecha, tipo, comentarios };

        if (id !== '') {
            // Modo Edición: 'id' contiene el índice
            estado.agenda[parseInt(id)] = nuevoEvento;
        } else {
            // Modo Creación: Añadir nuevo evento
            estado.agenda.push(nuevoEvento);
        }

        guardar();
        renderizarAgenda();
        limpiarFormularioAgenda();
    }

    function editarEvento(index) {
        const evento = estado.agenda[index];
        
        ui.eventoId.value = index; // Usamos el índice como ID temporal para editar
        ui.eventoTitulo.value = evento.titulo;
        ui.eventoFecha.value = evento.fecha; 
        ui.eventoTipo.value = evento.tipo;
        ui.eventoComentarios.value = evento.comentarios;
        ui.btnGuardarEvento.textContent = 'Actualizar Evento';
        
        // Desplazarse al formulario para el usuario
        ui.formAgenda.scrollIntoView({ behavior: 'smooth' });
    }

    function eliminarEvento(index) {
        if(window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
            estado.agenda.splice(index, 1);
            guardar();
            renderizarAgenda();
        }
    }

    // --- 8. GESTIÓN DE INFORME ---\
    
    function renderizarInforme() {
        // Ejemplo de cálculo para el informe
        const tareasCompletadasTotal = Object.values(estado.tareas).flat().filter(t => t.completado).length;
        const tareasFallidasTotal = Object.values(estado.tareas).flat().filter(t => t.fallido).length;
        
        const html = `
            <div class="detalle-diario-card">
                <h4>Puntos Totales</h4>
                <p class="big-number primary-text">${estado.puntos}</p>
            </div>
            <div class="detalle-diario-card">
                <h4>Minutos Restantes</h4>
                <p class="big-number secondary-text">${estado.minutos}</p>
            </div>
            <div class="detalle-diario-card">
                <h4>Tareas Hechas Hoy</h4>
                <p class="big-number accent-text">${tareasCompletadasTotal}</p>
            </div>
            <div class="detalle-diario-card">
                <h4>Tareas Fallidas Hoy</h4>
                <p class="big-number danger-text">${tareasFallidasTotal}</p>
            </div>
        `;
        ui.detalleDiarioGrid.innerHTML = html; // Usando el ID correcto

        // Puedes añadir más detalles del historial aquí, como una lista de canjes
        const historialHtml = estado.historial.map(item => 
            `<p class="text-sm border-t pt-2">${item.fecha} - **${item.tipo}** de ${item.detalle} (${item.costo})</p>`
        ).join('');

        if (estado.historial.length > 0) {
            ui.detalleDiarioGrid.insertAdjacentHTML('afterend', `
                <h4 class="mt-4">Historial de Canjes</h4>
                <div class="form-card p-4">${historialHtml}</div>
            `);
        }
    }

    // --- 9. INICIALIZACIÓN Y EVENT LISTENERS ---\

    cargar();
    actualizarUI();
    renderizarTareas(); // Renderiza la vista inicial por defecto
    
    // Toggle del formulario de Horario
    ui.btnToggleHorarioForm.addEventListener('click', () => {
        ui.formHorario.classList.toggle('hidden');
        if (!ui.formHorario.classList.contains('hidden')) {
            activarModoAdminHorario();
            limpiarFormularioHorario();
        } else {
            // Desactivar modo admin si se oculta
            ui.contenedorHorario.querySelectorAll('.btn-editar-horario, .btn-eliminar-horario').forEach(btn => {
                btn.style.display = 'none';
            });
        }
    });

    // Eventos de Navegación del Dock
    ui.btnTareas.addEventListener('click', () => {
        mostrarVista('vistaTareas', ui.btnTareas);
        renderizarTareas();
    });

    ui.btnShop.addEventListener('click', () => {
        mostrarVista('vistaShop', ui.btnShop);
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
    
    ui.btnReport.addEventListener('click', () => { // CORREGIDO: Usando ui.btnReport
        mostrarVista('vistaInforme', ui.btnReport);
        renderizarInforme(); 
    });

    // Eventos de Forms y Acciones
    ui.btnGuardarHorario.addEventListener('click', guardarActividad);
    ui.btnCancelarHorario.addEventListener('click', (e) => {
        e.preventDefault();
        ui.formHorario.classList.add('hidden');
        limpiarFormularioHorario();
        // Ocultar botones de admin al cancelar
        ui.contenedorHorario.querySelectorAll('.btn-editar-horario, .btn-eliminar-horario').forEach(btn => {
            btn.style.display = 'none';
        });
    });

    ui.formAgenda.addEventListener('submit', guardarEvento); 
    
    ui.btnDiario.addEventListener('click', () => {
        const hoy = new Date().toDateString();
        if (estado.ultimoDiario === hoy) {
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

}); // Fin DOMContentLoaded
