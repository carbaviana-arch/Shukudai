# 🧩 Shukudai 2.1

**Shukudai** es una aplicación web pensada para ayudar a los niños a organizar sus tareas diarias y ganar recompensas por su esfuerzo.
Esta versión **2.1** se centra en **correcciones y mejoras de estabilidad**, optimizando la carga de datos, la visualización de los días de la semana y la compatibilidad con dispositivos móviles.

---

## 🔧 Cambios en la versión 2.1

* ✅ Corrección del cálculo del día actual (`getDay()` ajustado para todos los navegadores).
* ⚙️ Verificación del orden de carga de scripts (`tasks.js` antes de `app.js`).
* 🧩 Se aseguran los IDs y contenedores para evitar errores de renderizado.
* 📱 Mejor compatibilidad en móviles y tablets.
* 🔒 Estructura de datos más estable en `localStorage`.

---

## 🚀 Funcionalidades actuales

* 📅 Registro diario: cada día de la semana tiene su panel desplegable.
* ✅ Marcar tareas como cumplidas o no cumplidas.
* 🧮 Marcador semanal: suma automáticamente los puntos obtenidos cada día.
* 💾 Guardado local: el progreso se almacena en `localStorage`.
* 🎯 1 punto = 1 minuto de recompensa.

---

## 📂 Estructura del proyecto

```
Shukudai/
│── index.html      → Estructura de la aplicación
│── style.css       → Estilos visuales y diseño
│── tasks.js        → Listado de tareas
│── app.js          → Lógica principal
│── README.md       → Descripción del proyecto
```

---

## 🕹️ Cómo usar

1. Abre `index.html` en tu navegador o visita tu enlace de GitHub Pages.
2. Despliega el día actual (por ejemplo, “Lunes”).
3. Marca las tareas completadas con **✅** o **❌**.
4. Observa cómo el marcador semanal suma tus puntos.
5. Cierra la página: el progreso se guarda automáticamente.

---

## 💡 Próximos pasos (versión 2.2 y futuras)

* 🌟 Barra de progreso semanal con emojis y niveles.
* 👨‍👩‍👧 Múltiples usuarios (padres/hijos).
* ☁️ Sincronización en la nube (Firebase).
* 🏅 Sistema de recompensas visuales desbloqueables.

---

## ❤️ Créditos

Desarrollado con cariño para fomentar la responsabilidad y el hábito en los más pequeños.
© 2025 — Proyecto educativo **Shukudai**.
