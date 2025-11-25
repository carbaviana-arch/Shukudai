document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN ---
    const META_XP = 150; // Puntos para subir nivel
    
    // Sonidos (URLs estables de Google CDN)
    const SONIDOS = {
        exito: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
        nivel: new Audio('https://actions.google.com/sounds/v1/cartoon/clown_horn.ogg'),
        error: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
        caja: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg')
    };

    const catalogoTareas = [
        {
            categoria: "Colegio 🏫",
            items: [
                { id: "mat", nombre: "Matemáticas", pts: 10, min: 20 },
                { id: "len", nombre: "Lengua", pts: 10, min: 20 },
                { id: "ing", nombre: "Inglés", pts: 10, min: 15 },
                { id: "lec", nombre: "Leer 15 min", pts: 5, min: 15 }
            ]
        },
        {
            categoria: "Hogar 🏠",
            items: [
                { id: "cama", nombre: "Hacer la cama", pts: 5, min: 5 },
                { id: "dientes", nombre: "Lavarse los dientes", pts: 3, min: 2 },
                { id: "recoger", nombre: "Recoger juguetes", pts: 8, min: 10 },
                { id: "ropa", nombre: "Poner ropa sucia", pts: 3, min: 2 }
            ]
        },
        {
            categoria: "Extra ⭐",
            items: [
                { id: "dibujo", nombre: "Dibujar / Arte", pts: 5, min: 20 },
                { id: "deporte", nombre: "Ejercicio", pts: 10, min: 30 }
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
                        <span class="task-pts">+${tarea.pts} pts • ${tarea.min} min</span>
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
                    lanzarConfeti(); // ¡Confeti también al comprar!
                    guardar();
                    renderizarTienda(); // Actualizar visualmente la tienda
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
        // Puedes añadir logica de fecha aquí para limitar a 1 vez
        estado.puntos += 10;
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
