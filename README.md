# 🧩 Shukudai 2.2.1

**Versión:** 2.2.1  
**Fecha:** Noviembre 2025  
**Autor:** [carbaviana-arch](https://github.com/carbaviana-arch)

---

## 🎯 Descripción general

**Shukudai** es una aplicación web que transforma las tareas diarias en un juego de superación.  
Diseñada para fomentar la responsabilidad y el esfuerzo en los más pequeños, combina **seguimiento de hábitos**, **recompensas** y **niveles de progreso**, todo dentro de una interfaz sencilla y motivadora.

Cada día tiene sus propias categorías de tareas y un sistema de puntos, recompensas diarias y niveles que suben cada 150 puntos, al estilo de los videojuegos.

---

## 🚀 Novedades de la versión 2.2.1

### 🔧 Mejoras funcionales
- ↩️ **Función “Deshacer”** totalmente operativa: permite revertir una tarea marcada y corrige automáticamente los puntos.  
- 🔁 **Reinicio semanal completo:** limpia puntos y estados de todas las tareas.  
- 🔄 **Reinicio diario individual:** cada día cuenta con su propio botón para reiniciar solo las tareas de ese día (ideal para penalizaciones leves).  
- 🟡 **Premio Diario** mantiene su función (+10 pts, una vez al día).  
- 📈 **Sistema de niveles** estable: sube un nivel cada 150 puntos acumulados.  

### 🎨 Mejoras visuales
- ✅❌↩️ **Botones alineados y organizados horizontalmente** para una presentación más limpia.  
- 🧭 Cabecera actualizada:  
  > “Seguimiento de tareas, recompensas y progreso semanal”  
- 🟠 Nuevo botón **Reiniciar [día]** al final de cada bloque diario.  
- 🎨 Sombras y colores más equilibrados.  

---

## 🧩 Funcionalidades principales

| Función | Descripción | Estado |
|----------|-------------|--------|
| ✅ Completar tarea | Marca una tarea como realizada y suma puntos. | ✔️ |
| ❌ No cumplida | Marca una tarea como fallida (sin sumar puntos). | ✔️ |
| ↩️ Deshacer | Revierte una acción si se marcó por error. | ✔️ |
| 🏅 Premio Diario | Otorga +10 puntos una vez al día. | ✔️ |
| 🔄 Reiniciar día | Borra las tareas y puntos solo de un día específico. | ✔️ |
| 🔁 Reiniciar marcador | Limpia el progreso semanal completo. | ✔️ |
| 📈 Nivel de progreso | Subida automática cada 150 puntos. | ✔️ |
| 💾 Guardado automático | Todos los datos se conservan en el navegador. | ✔️ |

---

## 🕹️ Cómo usar Shukudai

1. Abre la aplicación en tu navegador.  
2. Despliega el día de la semana correspondiente.  
3. Marca cada tarea con **✅** si fue cumplida o **❌** si no se logró.  
4. Si cometes un error, usa **↩️** para revertir la marca.  
5. Pulsa **🏅 Premio Diario** (solo una vez al día) para otorgar puntos extra.  
6. Usa **🔄 Reiniciar [día]** si quieres empezar de nuevo solo ese día.  
7. Usa **❌ Reiniciar Marcador** si quieres borrar todo el progreso semanal.  
8. Observa tu nivel y progreso en la sección “Progreso y Nivel”.

---

## 📊 Sistema de niveles

- Cada **150 puntos** equivale a un nuevo nivel.  
- La barra de progreso (XP) muestra cuánto falta para el siguiente.  
- Ejemplo:  
  - 0–149 pts → Nivel 1  
  - 150–299 pts → Nivel 2  
  - 300–449 pts → Nivel 3  
  - y así sucesivamente.

---

## ⚙️ Tecnologías utilizadas

- **HTML5** → estructura principal.  
- **CSS3** → estilos visuales y diseño adaptable.  
- **JavaScript Vanilla** → toda la lógica del juego, puntos y progreso.  
- **LocalStorage** → persistencia de datos sin conexión.

---

## 📁 Estructura del proyecto

📦 Shukudai 2.2.1
├── index.html # Estructura y contenido
├── style.css # Estilos visuales y layout
├── app.js # Lógica de tareas, puntos y niveles
└── README.md # Documentación del proyecto


---

## 💡 Consejos de uso

- Se recomienda abrir la app **una vez al día** y marcar las tareas al completarlas.  
- El **Premio Diario** solo puede otorgarse una vez por día natural.  
- Si algo se marca por error, usa el botón **↩️ Deshacer**.  
- El progreso se guarda automáticamente: puedes cerrar la página sin perder datos.  
- Para comenzar una nueva semana, usa el botón **❌ Reiniciar Marcador**.  

---

## 🧱 Futuras mejoras (versión 2.3 y posteriores)

- 📊 Gráficos de progreso semanal y mensual.  
- 🏆 Logros y medallas desbloqueables.  
- 🔔 Recordatorios automáticos.  
- 🌙 Modo oscuro.  
- 📤 Exportar progreso a archivo o PDF.

---

## 👨‍💻 Créditos

- **Desarrollo y diseño:** [Francisco Carballo (carbaviana-arch)](https://github.com/carbaviana-arch)  
- **Asistencia técnica y documentación:** ChatGPT (OpenAI)  
- **Inspiración:** Educación, constancia y refuerzo positivo en el hogar.  

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia **MIT**, lo que permite su uso, modificación y redistribución libre con atribución al autor original.

---

> 🧠 *“Cada día es una oportunidad para mejorar.  
> Shukudai convierte la constancia en aventura.”*

