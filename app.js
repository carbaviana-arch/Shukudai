// 🧩 SHUKUDAI 2.4 - Dock + Premio Semanal

const diasSemana = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
let diaActual = diasSemana[(new Date().getDay() + 6) % 7];
let progreso = {};

function cargarProgreso() {
  const data = localStorage.getItem('progresoShukudai');
  progreso = data ? JSON.parse(data) : {};
  diasSemana.forEach(d => {
    if (!progreso[d]) progreso[d] = { tareas:{}, puntosTotales:0, minutosTotales:0 };
  });
}

function guardarProgreso() {
  localStorage.setItem('progresoShukudai', JSON.stringify(progreso));
}

function calcularTotalSemanal() {
  return diasSemana.reduce((t,d)=>t+(progreso[d]?.puntosTotales||0),0);
}

function calcularNivel(puntos) {
  return Math.floor(puntos / 125) + 1;
}

function actualizarNivel() {
  const total = calcularTotalSemanal();
  const nivel = calcularNivel(total);
  const puntosEnNivel = total % 125;
  const progresoNivel = Math.round((puntosEnNivel / 125) * 100);
  document.getElementById('nivelActual').textContent = nivel;
  document.getElementById('xpFill').style.width = `${progresoNivel}%`;
  document.getElementById('xpTexto').textContent = `${puntosEnNivel} / 125 pts`;
}

// 🎁 Premio semanal
document.getElementById('btnPremioSemanal').addEventListener('click', () => {
  if (localStorage.getItem('premioSemanalUsado') === 'true') {
    alert('Ya has usado el Premio Semanal esta semana 🌟');
    return;
  }
  progreso[diaActual].puntosTotales += 70;
  progreso[diaActual].minutosTotales += 70;
  guardarProgreso();
  localStorage.setItem('premioSemanalUsado', 'true');
  alert('🌟 Premio Semanal otorgado (+70 pts)');
  actualizarNivel();
});

// Premio diario
document.getElementById('btnPremioDiario').addEventListener('click', () => {
  const hoy = new Date().toISOString().split('T')[0];
  if (localStorage.getItem(`premio-${hoy}`)) {
    alert('Ya has usado el Premio Diario hoy 🏅');
    return;
  }
  progreso[diaActual].puntosTotales += 10;
  progreso[diaActual].minutosTotales += 10;
  guardarProgreso();
  localStorage.setItem(`premio-${hoy}`, 'true');
  alert('🎉 Premio Diario otorgado (+10 pts)');
  actualizarNivel();
});

cargarProgreso();
actualizarNivel();
