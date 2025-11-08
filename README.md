# 🧩 Shukudai 2.3

**Versión:** 2.3  
**Fecha:** Noviembre 2025  
**Autor:** [carbaviana-arch](https://github.com/carbaviana-arch)

---

## 🎯 Descripción general

**Shukudai** es una aplicación web que convierte las tareas diarias en un sistema de juego para fomentar la responsabilidad y la constancia.  
Incluye seguimiento por día, recompensas diarias y semanales, un sistema de niveles y ahora gráficos y medallas visuales para motivar aún más.

---

## 🚀 Novedades de la versión 2.3

- 📊 **Registro gráfico** del progreso semanal (barras por día) y mensual (últimos 30 días).  
- 🏅 **Medallas/insignias**: aparecen al subir de nivel (medallas de bronce/plata/oro/platino en niveles clave).  
- 💚 **Premio Semanal (+60 pts)**: botón nuevo para recompensa semanal (solo una vez por semana).  
- 🔄 **Reinicio diario** mejor espaciado y centrado al final de cada día.  
- ☢️ **Icono de Reiniciar Marcador cambiado a símbolo nuclear** para indicar acción fuerte.  
- Se mantienen: Premio Diario (+10 pts), Deshacer, Reinicio semanal, sistema de niveles (150 pts por nivel), persistencia en LocalStorage.

> Nota: el Premio Semanal aplica +60 puntos al **día actual** para mantener puntos enteros; esto evita fracciones y es fácil de auditar. (Si prefieres repartir entre varios días, lo adaptamos).

---

## 🧩 Funcionalidades principales

| Función | Descripción | Estado |
|--------:|-------------|:------:|
| ✅ Completar tarea | Marca una tarea como realizada y suma puntos. | ✔️ |
| ❌ No cumplida | Marca una tarea como fallida (sin sumar puntos). | ✔️ |
| ↩️ Deshacer | Revierte una acción si se marcó por error. | ✔️ |
| 🏅 Premio Diario | Otorga +10 puntos una vez al día. | ✔️ |
| 💚 Premio Semanal | Otorga +60 puntos una vez por semana (aplicado al día actual). | ✔️ |
| 🔄 Reiniciar día | Borra las tareas y puntos solo de un día específico. | ✔️ |
| ☢️ Reiniciar marcador | Reinicio total semanal (limpia puntos y estados). | ✔️ |
| 📈 Historial gráfico | Gráficos semanales y mensuales desde datos guardados. | ✔️ |
| 🏅 Medallas | Insignias automáticas al subir nivel (niveles clave). | ✔️ |
| 💾 Guardado automático | Persistencia de datos local (LocalStorage). | ✔️ |

---

## 🕹️ Cómo usar

1. Abre la app en un navegador moderno.  
2. Expande el día correspondiente y marca tareas con ✅ o ❌.  
3. Usa ↩️ para deshacer una marca incorrecta.  
4. Pulsa 🏅 Premio Diario (+10) una vez al día si corresponde.  
5. Pulsa 💚 Premio Semanal (+60) una vez por semana para recompensa adicional (se aplica al día actual).  
6. Si quieres reiniciar un día concreto, usa 🔄 Reiniciar [día] al final de ese bloque.  
7. Para reiniciar toda la semana, usa ☢️ Reiniciar Marcador.  
8. Consulta la sección **Historial de progreso** para ver gráficos semanales y mensuales.  
9. Al subir de nivel, fíjate en la medalla que aparece en la sección de progreso.

---

## ⚙️ Tecnologías

- **HTML5**, **CSS3**, **JavaScript (Vanilla)**  
- **Canvas** para gráficos (sin librerías externas)  
- **LocalStorage** para persistencia local

---

## 📁 Estructura del proyecto

Shukudai v2.3
├── index.html
├── style.css
├── app.js
└── README.md


---

## 💡 Notas técnicas

- Los gráficos semanales usan los totales por día almacenados en la estructura `progreso`.  
- El histórico mensual se construye a partir de `progresoDiario` (mapa fecha → puntos). El sistema actual actualiza la entrada diaria cada vez que se guarda progreso. Esto genera una visión simple de los últimos 30 días.  
- Las medallas se activan cuando el nivel calculado supera el nivel almacenado previamente en `localStorage` (clave `shukudai_lastLevel`).  
- El Premio Semanal está limitado a una vez por semana (clave `premioSem-YYYY-Wn` en localStorage).  

---

## 🧱 Futuras mejoras (2.4+)

- Exportar/importar progreso (CSV / JSON).  
- Recordatorios por notificación.  
- Logros avanzados y pantalla de recompensas.  
- Modo oscuro y accesibilidad mejorada.  
- Opciones para distribuir premio semanal entre varios días.

---

## 👨‍💻 Créditos

- **Desarrollo y diseño:** Francisco Carballo (carbaviana-arch)  
- **Asistencia técnica:** ChatGPT (OpenAI)

---

## 📜 Licencia

MIT — libre uso y modificación con atribución.

---
