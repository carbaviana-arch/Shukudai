// ================================
//   ESTADO + MIGRACIÓN
// ================================

let estado = JSON.parse(localStorage.getItem("shukudai_v3_data")) || {};

estado = {
  puntos: 0,
  nivel: 1,
  tareasHoy: [],
  agendaEventos: [],
  ultimoDiario: null,
  ultimoSemanal: null,
  ultimaFecha: new Date().toDateString(),
  ...estado
};

const ui = {
  nivel: document.getElementById("nivel"),
  xpBar: document.getElementById("xpBar"),
  listaTareas: document.getElementById("listaTareas"),
  listaAgenda: document.getElementById("listaAgenda"),
  tienda: document.getElementById("tienda"),
  btnDiario: document.getElementById("btnDiario"),
  btnSemanal: document.getElementById("btnSemanal"),
  formAgenda: document.getElementById("formAgenda"),
};

// ================================
//   GUARDAR
// ================================
function guardar() {
  localStorage.setItem("shukudai_v3_data", JSON.stringify(estado));
  actualizarUI();
}

// ================================
//   UI PRINCIPAL
// ================================
function actualizarUI() {
  ui.nivel.textContent = estado.nivel;

  const maxXP = 125;
  const porcentaje = Math.min((estado.puntos % maxXP) / maxXP * 100, 100);
  ui.xpBar.style.width = porcentaje + "%";
}

// ================================
//   CONTROL DIARIO / SEMANAL
// ================================

function getWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}

ui.btnDiario.addEventListener("click", () => {
  const hoy = new Date().toDateString();
  if (estado.ultimoDiario === hoy) {
    alert("Ya recogiste la recompensa diaria hoy.");
    return;
  }

  estado.puntos += 50;
  estado.ultimoDiario = hoy;
  guardar();
});

ui.btnSemanal.addEventListener("click", () => {
  const semana = getWeekKey();
  if (estado.ultimoSemanal === semana) {
    alert("Ya recogiste la recompensa semanal.");
    return;
  }

  estado.puntos += 125;
  estado.ultimoSemanal = semana;
  guardar();
});

// ================================
//   TAREAS
// ================================
function renderTareas() {
  ui.listaTareas.innerHTML = "";

  estado.tareasHoy.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.texto}</span>
      <button class="btn" data-id="${i}">✓</button>
    `;
    ui.listaTareas.appendChild(li);
  });
}

ui.listaTareas.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  estado.tareasHoy.splice(id, 1);
  estado.puntos += 10;
  guardar();
  renderTareas();
});

// ================================
//   AGENDA
// ================================
ui.formAgenda.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("agendaTitulo").value;
  const desc = document.getElementById("agendaDescripcion").value;
  const fecha = document.getElementById("agendaFecha").value;

  estado.agendaEventos.push({ titulo, desc, fecha, id: Date.now() });
  guardar();
  renderAgenda();

  ui.formAgenda.reset();
});

function renderAgenda() {
  ui.listaAgenda.innerHTML = "";

  estado.agendaEventos.forEach(evt => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${evt.titulo}</strong><br>
        <small>${evt.fecha}</small>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-edit" data-id="${evt.id}">✏️</button>
        <button class="btn btn-delete" data-id="${evt.id}">🗑️</button>
      </div>
    `;
    ui.listaAgenda.appendChild(li);
  });
}

ui.listaAgenda.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;

  if (btn.classList.contains("btn-delete")) {
    estado.agendaEventos = estado.agendaEventos.filter(e => e.id != id);
    guardar();
    renderAgenda();
  }
});

// ================================
//   TIENDA
// ================================
const productos = [
  { id: 1, nombre: "Caramelo", costo: 20 },
  { id: 2, nombre: "Jugo", costo: 40 },
  { id: 3, nombre: "Tiempo libre (15min)", costo: 80 },
];

function renderTienda() {
  ui.tienda.innerHTML = "";

  productos.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${p.nombre} — ${p.costo} pts</span>
      <button class="btn" data-id="${p.id}">Comprar</button>
    `;
    ui.tienda.appendChild(li);
  });
}

ui.tienda.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = parseInt(btn.dataset.id);
  const prod = productos.find(x => x.id === id);

  if (estado.puntos < prod.costo) {
    alert("No tienes suficientes puntos.");
    return;
  }

  estado.puntos -= prod.costo;
  guardar();
});

// ================================
//   INICIO
// ================================
renderTareas();
renderAgenda();
renderTienda();
actualizarUI();
