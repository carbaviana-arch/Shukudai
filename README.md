# 馃З Shukudai 2.2.1

**Versi贸n:** 2.2.1  
**Fecha:** Noviembre 2025  
**Autor:** [carbaviana-arch](https://github.com/carbaviana-arch)

---

## 馃幆 Descripci贸n general

**Shukudai** es una aplicaci贸n web que transforma las tareas diarias en un juego de superaci贸n.  
Dise帽ada para fomentar la responsabilidad y el esfuerzo en los m谩s peque帽os, combina **seguimiento de h谩bitos**, **recompensas** y **niveles de progreso**, todo dentro de una interfaz sencilla y motivadora.

Cada d铆a tiene sus propias categor铆as de tareas y un sistema de puntos, recompensas diarias y niveles que suben cada 150 puntos, al estilo de los videojuegos.

---

## 馃殌 Novedades de la versi贸n 2.2.1

### 馃敡 Mejoras funcionales
- 鈫╋笍 **Funci贸n 鈥淒eshacer鈥?* totalmente operativa: permite revertir una tarea marcada y corrige autom谩ticamente los puntos.  
- 馃攣 **Reinicio semanal completo:** limpia puntos y estados de todas las tareas.  
- 馃攧 **Reinicio diario individual:** cada d铆a cuenta con su propio bot贸n para reiniciar solo las tareas de ese d铆a (ideal para penalizaciones leves).  
- 馃煛 **Premio Diario** mantiene su funci贸n (+10 pts, una vez al d铆a).  
- 馃搱 **Sistema de niveles** estable: sube un nivel cada 150 puntos acumulados.  

### 馃帹 Mejoras visuales
- 鉁呪潓鈫╋笍 **Botones alineados y organizados horizontalmente** para una presentaci贸n m谩s limpia.  
- 馃Л Cabecera actualizada:  
  > 鈥淪eguimiento de tareas, recompensas y progreso semanal鈥? 
- 馃煚 Nuevo bot贸n **Reiniciar [d铆a]** al final de cada bloque diario.  
- 馃帹 Sombras y colores m谩s equilibrados.  

---

## 馃З Funcionalidades principales

| Funci贸n | Descripci贸n | Estado |
|----------|-------------|--------|
| 鉁?Completar tarea | Marca una tarea como realizada y suma puntos. | 鉁旓笍 |
| 鉂?No cumplida | Marca una tarea como fallida (sin sumar puntos). | 鉁旓笍 |
| 鈫╋笍 Deshacer | Revierte una acci贸n si se marc贸 por error. | 鉁旓笍 |
| 馃弲 Premio Diario | Otorga +10 puntos una vez al d铆a. | 鉁旓笍 |
| 馃攧 Reiniciar d铆a | Borra las tareas y puntos solo de un d铆a espec铆fico. | 鉁旓笍 |
| 馃攣 Reiniciar marcador | Limpia el progreso semanal completo. | 鉁旓笍 |
| 馃搱 Nivel de progreso | Subida autom谩tica cada 150 puntos. | 鉁旓笍 |
| 馃捑 Guardado autom谩tico | Todos los datos se conservan en el navegador. | 鉁旓笍 |

---

## 馃暪锔?C贸mo usar Shukudai

1. Abre la aplicaci贸n en tu navegador.  
2. Despliega el d铆a de la semana correspondiente.  
3. Marca cada tarea con **鉁?* si fue cumplida o **鉂?* si no se logr贸.  
4. Si cometes un error, usa **鈫╋笍** para revertir la marca.  
5. Pulsa **馃弲 Premio Diario** (solo una vez al d铆a) para otorgar puntos extra.  
6. Usa **馃攧 Reiniciar [d铆a]** si quieres empezar de nuevo solo ese d铆a.  
7. Usa **鉂?Reiniciar Marcador** si quieres borrar todo el progreso semanal.  
8. Observa tu nivel y progreso en la secci贸n 鈥淧rogreso y Nivel鈥?

---

## 馃搳 Sistema de niveles

- Cada **150 puntos** equivale a un nuevo nivel.  
- La barra de progreso (XP) muestra cu谩nto falta para el siguiente.  
- Ejemplo:  
  - 0鈥?49 pts 鈫?Nivel 1  
  - 150鈥?99 pts 鈫?Nivel 2  
  - 300鈥?49 pts 鈫?Nivel 3  
  - y as铆 sucesivamente.

---

## 鈿欙笍 Tecnolog铆as utilizadas

- **HTML5** 鈫?estructura principal.  
- **CSS3** 鈫?estilos visuales y dise帽o adaptable.  
- **JavaScript Vanilla** 鈫?toda la l贸gica del juego, puntos y progreso.  
- **LocalStorage** 鈫?persistencia de datos sin conexi贸n.

---

## 馃搧 Estructura del proyecto

馃摝 Shukudai 2.2.1
鈹溾攢鈹€ index.html # Estructura y contenido
鈹溾攢鈹€ style.css # Estilos visuales y layout
鈹溾攢鈹€ app.js # L贸gica de tareas, puntos y niveles
鈹斺攢鈹€ README.md # Documentaci贸n del proyecto


---

## 馃挕 Consejos de uso

- Se recomienda abrir la app **una vez al d铆a** y marcar las tareas al completarlas.  
- El **Premio Diario** solo puede otorgarse una vez por d铆a natural.  
- Si algo se marca por error, usa el bot贸n **鈫╋笍 Deshacer**.  
- El progreso se guarda autom谩ticamente: puedes cerrar la p谩gina sin perder datos.  
- Para comenzar una nueva semana, usa el bot贸n **鉂?Reiniciar Marcador**.  

---

## 馃П Futuras mejoras (versi贸n 2.3 y posteriores)

- 馃搳 Gr谩ficos de progreso semanal y mensual.  
- 馃弳 Logros y medallas desbloqueables.  
- 馃敂 Recordatorios autom谩ticos.  
- 馃寵 Modo oscuro.  
- 馃摛 Exportar progreso a archivo o PDF.

---

## 馃懆鈥嶐煉?Cr茅ditos

- **Desarrollo y dise帽o:** [Francisco Carballo (carbaviana-arch)](https://github.com/carbaviana-arch)  
- **Asistencia t茅cnica y documentaci贸n:** ChatGPT (OpenAI)  
- **Inspiraci贸n:** Educaci贸n, constancia y refuerzo positivo en el hogar.  

---

## 馃摐 Licencia

Este proyecto se distribuye bajo la licencia **MIT**, lo que permite su uso, modificaci贸n y redistribuci贸n libre con atribuci贸n al autor original.

---

> 馃 *鈥淐ada d铆a es una oportunidad para mejorar.  
> Shukudai convierte la constancia en aventura.鈥?

