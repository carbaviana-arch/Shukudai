document.addEventListener("DOMContentLoaded", () => {
  let puntosTotales = 0;
  let minutosTotales = 0;
  let nivelActual = 1;
  const metaXP = 125;

  const puntosEl = document.getElementById("puntosTotales");
  const minutosEl = document.getElementById("minutosTotales");
  const nivelEl = document.getElementById("nivelActual");
  const xpFill = document.getElementById("xpFill");
  const xpTexto = document.getElementById("xpTexto");

  const btnPremioDiario = document.getElementById("btnPremioDiario");
  const btnPremioSemanal = document.getElementById("btnPremioSemanal");
  const btnReset = document.getElementById("btnReset");

  function actualizarPantalla() {
    puntosEl.textContent = puntosTotales;
    minutosEl.textContent = minutosTotales;
    nivelEl.textContent = nivelActual;
    const porcentaje = Math.min((puntosTotales % metaXP) / metaXP * 100, 100);
    xpFill.style.width = porcentaje + "%";
    xpTexto.textContent = `${puntosTotales % metaXP} / ${metaXP} pts`;

    if (puntosTotales >= nivelActual * metaXP) {
      nivelActual++;
      alert("🎉 ¡Has subido al nivel " + nivelActual + "!");
    }
  }

  btnPremioDiario.addEventListener("click", () => {
    puntosTotales += 10;
    actualizarPantalla();
  });

  btnPremioSemanal.addEventListener("click", () => {
    puntosTotales += 70;
    actualizarPantalla();
  });

  btnReset.addEventListener("click", () => {
    if (confirm("¿Seguro que quieres reiniciar el marcador?")) {
      puntosTotales = 0;
      minutosTotales = 0;
      nivelActual = 1;
      actualizarPantalla();
    }
  });

  actualizarPantalla();
});
