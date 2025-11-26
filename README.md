# Shukudai: Misión Recompensa - v3.1 ⭐️

**Shukudai** (宿題, "deberes" en japonés) es un sistema gamificado simple, implementado en un único archivo HTML/JavaScript, diseñado para ayudar a gestionar y motivar la realización de tareas y la buena conducta a través de puntos y recompensas.

## 🚀 Novedades de la Versión 3.1: Gestión Total del Horario

La característica principal de esta versión es la implementación completa del **CRUD (Crear, Leer, Actualizar, Eliminar)** de actividades en la sección "Horario".

---

## ✨ Características Principales

### 1. Sistema de Gamificación (Puntos, Minutos y Nivel)
* **Puntos (Pts):** Se obtienen por completar tareas con éxito. Se usan para comprar premios "físicos" o experiencias.
* **Minutos (Min):** Se obtienen por completar tareas con éxito. Funcionan como tiempo de pantalla canjeable (tablet, consola, etc.).
* **Nivel:** Se calcula automáticamente (cada 125 puntos = +1 Nivel) con un efecto de confeti visual de celebración.
* **Recompensas Diarias/Semanales:** Botones rápidos para sumar puntos bonus recurrentes.

### 2. Tareas (Home)
* Panel de gestión diaria con categorías predefinidas (**Aseo, Académico, Hogar, General**).
* Se puede marcar cada tarea como **✅ Hecha** (sumando Puntos/Minutos) o **❌ Fallida** (sin sumar).
* Las tareas se resetean automáticamente al iniciar un **Nuevo Día**.

### 3. Tienda de Premios
* Catálogo de recompensas canjeables por **Puntos** o **Minutos**.
* **Regla del Fin de Semana:** El canje de premios solo está permitido los **Sábados y Domingos** para fomentar la concentración durante la semana.

### 4. Agenda y Eventos (CRUD)
* Sección para planificar eventos importantes como **Exámenes, Entregas de Trabajo o Citas**.
* **Creación, Edición y Eliminación** de eventos persistentes.

### 5. Horario Escolar (Gestión CRUD Total - ¡NUEVO!)
El Horario ahora es completamente personalizable:
* **Botón ⚙️ Administrar:** Activa el "Modo Gestión" y muestra el formulario CRUD.
* **Crear:** Añadir nuevas clases o actividades extraescolares a cualquier día de la semana.
* **Editar:** Modificar el nombre, hora, día o tipo de cualquier actividad existente.
* **Eliminar:** Quitar actividades del horario.
* **Persistencia:** Todos los cambios realizados en el horario se guardan automáticamente en el almacenamiento local.

---

## 🛠️ Instalación y Uso

**Shukudai** está diseñado para ser extremadamente fácil de usar y no requiere ningún servidor ni herramientas de construcción.

1.  **Guardar el Código:** Guarda todo el código HTML proporcionado en un único archivo llamado `index.html`.
2.  **Abrir en Navegador:** Abre el archivo `index.html` con cualquier navegador web moderno (Chrome, Safari, Firefox).
3.  **Persistencia:** Todos los datos (puntos, tareas, agenda y el horario personalizado) se guardan automáticamente en la memoria local de tu navegador (`localStorage`). No necesitas guardar el archivo `index.html` cada vez que lo editas, solo la primera vez.

**⚠️ Advertencia:** Para evitar la pérdida de datos, utiliza siempre el mismo navegador y dispositivo. Si borras el caché/datos del sitio, los datos se perderán (a menos que uses el botón de **Resetear** intencionadamente).
