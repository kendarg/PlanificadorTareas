# 📋 Gestor de Tareas

Aplicación web para gestionar tareas de forma sencilla mediante una interfaz interactiva. Permite abrir un formulario para registrar nuevas tareas, validar la información ingresada y mostrar una notificación cuando la tarea ha sido agregada correctamente.

El proyecto utiliza **JavaScript, Bootstrap y SweetAlert2** para construir la interfaz y las ventanas modales. La estructura visual incluye una sección de tareas, notas adicionales y diferentes niveles de importancia.

## 🚀 Funcionalidades

* ➕ Agregar nuevas tareas.
* 📝 Registrar información de la tarea:

  * Título.
  * Persona a cargo.
  * Importancia.
  * Fecha.
  * Notas.
* ⚠️ Validación de campos obligatorios.
* 🟢 Indicadores visuales para campos válidos.
* 🔴 Indicadores visuales para campos inválidos.
* 🔔 Notificación de éxito al agregar una tarea.
* 🗑️ Interfaz preparada para acciones como editar, completar y eliminar tareas.
* 🌙 Opción de cambio de modo visual.
* 📌 Sección de notas extras.

## 🛠️ Tecnologías utilizadas

* **HTML5** — Estructura de la aplicación.
* **CSS3** — Estilos personalizados.
* **JavaScript** — Lógica e interacción con el usuario.
* **Bootstrap 5.3.3** — Diseño responsive y componentes visuales.
* **Bootstrap Icons** — Iconos utilizados en la interfaz.
* **SweetAlert2** — Ventanas modales, formularios y notificaciones.

La interfaz utiliza Bootstrap 5.3.3 y Bootstrap Icons mediante CDN.

## 📂 Estructura del proyecto

```text
Proyecto/
│
├── Index.html
│
├── Css/
│   ├── styles.css
│   └── vision.css
│
└── Js/
    ├── visual.js
    └── alerta.js
```

## 📝 Formulario de nueva tarea

Al presionar el botón **"Agregar Tarea"**, se abre una ventana de SweetAlert2 con un formulario para introducir los datos de la tarea. El botón se encuentra identificado mediante `btnNuevaTarea`.

El formulario solicita:

```text
Título
Persona a cargo
Importancia
Fecha
Notas
```

La importancia puede clasificarse como:

* 🔴 Alta
* 🟡 Media
* 🟢 Baja

## ✅ Validación

Antes de agregar la tarea se revisa que todos los campos obligatorios tengan información.

Si algún campo está vacío, se marca como inválido y se muestra un mensaje indicando que deben diligenciarse todos los campos.

Cuando los campos son correctos, se obtiene la información de la tarea y se prepara un objeto con sus datos:

```javascript
{
    titulo,
    persona,
    importancia,
    fecha,
    notas
}
```

## 🔔 Notificación

Después de confirmar una tarea, se muestra una notificación tipo **Toast** en la parte superior derecha indicando que la tarea fue agregada correctamente.

También se muestran los datos de la tarea en la consola del navegador para comprobar que la información fue recibida correctamente.

## 🎨 Interfaz

La aplicación cuenta con:

* Barra de navegación.
* Panel lateral de notas.
* Área principal de tareas.
* Botón para agregar tareas.
* Indicadores de importancia.
* Fecha de cada tarea.
* Acciones para editar, completar y eliminar.

La sección principal muestra las tareas junto con iconos de edición, finalización y eliminación.

## ▶️ Figma, Trelo y Gitpage
* Figma:
- https://www.figma.com/design/gsS7yzaMTd99tSOECDah1x/Sin-t%C3%ADtulo?node-id=74-11&t=KPrZ0YdlOD33uVDF-1
* Trelo: https://trello.com/invite/b/6a6ba35f30f69a3c4c7acc56/ATTI65e0e9f4ef5bedbdaf73187603904658B74D1714/planificador-de-tareas
* Gitpage: https://kendarg.github.io/PlanificadorTareas/


```


## 👨‍💻 Autor

**Kendarg Esteban Real Lopez**

Proyecto desarrollado con fines educativos y de práctica en desarrollo web frontend.
