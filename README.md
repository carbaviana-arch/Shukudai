# 🧩 Shukudai 2.2

**Versión:** 2.2  
**Fecha:** Noviembre 2025  
**Autor:** [carbaviana-arch](https://github.com/carbaviana-arch)

---

## 🎯 Descripción general

**Shukudai** es una aplicación web creada para ayudar a niños y familias a organizar las tareas diarias de una forma divertida y visual.  
Cada tarea otorga puntos que se acumulan a lo largo de la semana y permiten **subir de nivel**, al estilo de los videojuegos.  
También incluye **premios diarios** y un sistema de seguimiento de progreso semanal y mensual.

El objetivo es **fomentar la responsabilidad, la constancia y el buen comportamiento** a través de la gamificación.

---

## 🚀 Novedades de la versión 2.2

- ✅ **Corrección de los desplegables**: los días de la semana mantienen su estado abierto incluso tras actualizar tareas.  
- 🟡 **Nuevo botón “Premio Diario”**: otorga +10 puntos por buena conducta o rendimiento académico (solo una vez al día).  
- ↩️ **Opción para destildar tareas** en caso de error (evita sumar o restar puntos erróneamente).  
- 📈 **Sistema de progreso y niveles**:  
  - El nivel sube cada **150 puntos**.  
  - Incluye una **barra de experiencia (XP)** que muestra el avance hacia el siguiente nivel.  
- 💾 **Datos persistentes** en `localStorage`: las tareas y el progreso se guardan automáticamente.  
- 🎨 **Diseño visual mejorado**, con colores coherentes, sombras suaves y estructura limpia.

---

## 🧩 Funcionalidades principales

| Función | Descripción |
|----------|-------------|
| ✅ Completar tarea | Marca una tarea como realizada y suma puntos. |
| ❌ No cumplida | Marca una tarea como fallida (sin sumar puntos). |
| ↩️ Deshacer | Revierte una acción si se marcó por error. |
| 🏅 Premio Diario | Otorga +10 puntos una vez al día. |
| 🔁 Reiniciar Marcador | Borra todo el progreso semanal. |
| 📈 Nivel de progreso | Subida automática de nivel cada 150 puntos. |
| 💾 Guardado automático | Se conserva todo en el navegador del usuario. |

---

## 🕹️ Cómo usar Shukudai

1. Abre la aplicación desde tu navegador.  
2. Cada día de la semana tiene su propio panel desplegable.  
3. Dentro de cada día verás las categorías:  
   - **Aseo e higiene personal**  
   - **Académico**  
   - **Hogar**  
   - **General**
4. Marca cada tarea con **✅** o **❌**.  
5. Usa **🏅 Premio Diario** una vez al día si hubo buen comportamiento o notas destacadas.  
6. Observa tu progreso y **nivel** en la sección *Progreso y Nivel*.  
7. Si necesitas comenzar de nuevo, pulsa **❌ Reiniciar Marcador**.  

---

## 📊 Sistema de niveles

- Cada **150 puntos** equivale a **1 nivel**.  
- La barra de progreso se llena con los puntos actuales del nivel.  
- Al alcanzar 150 puntos, el nivel sube automáticamente a +1.  
- Ejemplo:
  - 0–149 pts → Nivel 1  
  - 150–299 pts → Nivel 2  
  - 300–449 pts → Nivel 3  
  - ... y así sucesivamente.

---

## ⚙️ Tecnologías utilizadas

- **HTML5** – estructura base del proyecto.  
- **CSS3** – estilos visuales con colores suaves y diseño adaptado.  
- **JavaScript (Vanilla)** – lógica de tareas, puntos y progreso.  
- **LocalStorage** – almacenamiento de progreso sin necesidad de servidor.  

No se emplean frameworks externos, lo que facilita su ejecución **offline** y sin instalación adicional.

---

## 📁 Estructura del proyecto

📦 Shukudai 2.2
├── index.html # Estructura principal del sitio
├── style.css # Estilos visuales (colores, botones, layouts)
├── app.js # Lógica principal (tareas, puntos, progreso, nivel)
└── README.md # Documentación del proyecto


---

## 💡 Recomendaciones de uso

- Abre la app desde un navegador actualizado (Chrome, Edge, Firefox, Safari).  
- Si quieres reiniciar todo, puedes limpiar el almacenamiento local del navegador.  
- Se recomienda **usar la app diariamente**, asignando el Premio Diario al final del día.  

---

## 🧱 Futuras mejoras (versión 2.3 y posteriores)

- 📅 Estadísticas visuales del progreso mensual.  
- 🏆 Sistema de logros y medallas.  
- 🔔 Recordatorios automáticos de tareas.  
- 🌙 Modo oscuro opcional.  
- 🧮 Exportación del progreso a archivo o PDF.

---

## 👨‍💻 Créditos

- **Desarrollo y diseño:** [Francisco Carballo (carbaviana-arch)](https://github.com/carbaviana-arch)  
- **Asistencia técnica y documentación:** ChatGPT (OpenAI)  
- **Inspiración:** Educación, constancia y refuerzo positivo en el hogar.

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia **MIT**, lo que permite su uso, modificación y distribución libre, siempre que se mantengan los créditos originales.

---

> 🧠 *“Cada tarea completada es un paso más hacia la excelencia.  
> Shukudai convierte el esfuerzo diario en un juego de superación.”*
