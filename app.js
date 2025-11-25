document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN ---
    // SHUKUDAI 2.4: La meta de XP para subir de nivel es 125 puntos.
    const META_XP = 125; 
    
    // Sonidos (URLs estables de Google CDN)
    const SONIDOS = {
        exito: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
        nivel: new Audio('https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'),
        error: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
        caja: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg')
    };

    // --- NUEVO LISTADO DE TAREAS (VERSIÓN 2.4) ---
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
                // Las tareas de actitud y lenguaje no suman minutos activos, por eso min: 0
                { id: "lenguaje", nombre: "Lenguaje Respetuoso", pts: 1, min: 0 },
                { id: "actitud", nombre: "Buena Actitud", pts: 1, min: 0 },
                { id: "colaborar", nombre: "Colabora en Labores Hogar", pts: 1, min: 15 }
            ]
        }
    ];

    const catalogoPremios = [
        { id: 'peli', nombre: 'Noche de Cine', icono: '🎬', coste: 100 },
        { id: 'helado', nombre: 'Comer Helado', icono: '🍦', coste: 50 },
        { id: 'parque', nombre: 'Ir al Parque', icono: '🛝', coste: 30 },
        { id: 'tablet', nombre: '30 min Tablet', icono: '📱', coste: 80 },
        { id: 'pizza', nombre: 'Cena Pizza', icono: '🍕', coste: 200 }
    ];

    // --- 2. ESTADO Y PERSISTENCIA ---
    // Intentamos cargar del localStorage
    let estado = JSON.parse(localStorage.getItem('shukudai_v3_data')) || {
        puntos: 0,
        minutos: 0,
        nivel: 1,
        tareasHoy: {},
        ultimaFecha: new Date().toDateString()
    };

    // --- 3. LÓGICA DE NUEVO DÍA ---
    const hoy = new Date().toDateString();
    if (estado.ultimaFecha !== hoy) {
        // Es un día distinto al guardado -> Reseteamos tareas
        console.log("¡Nuevo día detectado!");
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
        vistaTareas: document.getElementById('vistaTareas'),
        vistaTienda: document.getElementById('vistaTienda'),
        btnHome: document.getElementById('homeBtn'),
        btnShop: document.getElementById('shopBtn'),
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
            alert(`🎉 ¡INCREÍBLE! ¡Has subido al NIVEL ${estado.nivel}! 🎉`); 
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

    // --- 6. RENDERIZADO ---
    function renderizarTareas() {
        ui.contenedorCategorias.innerHTML = '';

        catalogoTareas.forEach(grupo => {
            const details = document.createElement('details');
            details.open = true; // Abierto por defecto
            
            const summary = document.createElement('summary');
            summary.textContent = grupo.categoria;
            details.appendChild(summary);

            grupo.items.forEach(tarea => {
                const div = document.createElement('div');
                div.className = 'task';
                
                // Comprobar estado
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

                // Eventos
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
            const card = document.createElement('div');
            card.className = 'premio-card';
            
            // Ver si alcanza el dinero
            const puedeComprar = estado.puntos >= premio.coste;
            card.style.opacity = puedeComprar ? '1' : '0.5';

            card.innerHTML = `
                <div class="premio-icono">${premio.icono}</div>
                <div style="font-weight:bold;">${premio.nombre}</div>
                <div class="price-tag">${premio.coste} pts</div>
            `;

            card.addEventListener('click', () => {
                if (!puedeComprar) {
                    reproducir('error');
                    alert(`Te faltan ${premio.coste - estado.puntos} puntos.`); 
                    return;
                }
                if (confirm(`¿Comprar "${premio.nombre}" por ${premio.coste} puntos?`)) {
                    estado.puntos -= premio.coste;
                    reproducir('caja');
                    lanzarConfeti(); 
                    guardar();
                    renderizarTienda(); 
                }
            });

            ui.contenedorPremios.appendChild(card);
        });
    }

    // --- 7. ACCIONES ---
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

    // --- 8. EVENTOS GLOBALES ---
    ui.btnHome.addEventListener('click', () => {
        ui.vistaTienda.style.display = 'none';
        ui.vistaTareas.style.display = 'block';
        ui.btnHome.classList.add('active');
        ui.btnShop.classList.remove('active');
        renderizarTareas();
    });

    ui.btnShop.addEventListener('click', () => {
        ui.vistaTareas.style.display = 'none';
        ui.vistaTienda.style.display = 'block';
        ui.btnShop.classList.add('active');
        ui.btnHome.classList.remove('active');
        renderizarTienda();
    });

    ui.btnDiario.addEventListener('click', () => {
        const hoy = new Date().toDateString();
        if (estado.ultimoDiario === hoy) {
            alert("Ya has recogido el premio diario de hoy. Vuelve mañana.");
            reproducir('error');
            return;
        }

        estado.puntos += 10;
        estado.ultimoDiario = hoy; 
        reproducir('exito');
        guardar();
        alert("+10 Puntos recibidos 🎁");
    });

    ui.btnSemanal.addEventListener('click', () => {
        if(confirm("¿Reclamar premio semanal (+70)?")) {
            estado.puntos += 70;
            reproducir('nivel');
            guardar();
        }
    });

    ui.btnReset.addEventListener('click', () => {
        if(confirm("⚠️ ¿BORRAR TODO? Se perderán puntos y nivel.")) {
            localStorage.removeItem('shukudai_v3_data');
            location.reload();
        }
    });

    // INICIO
    renderizarTareas();
    actualizarUI();
});
