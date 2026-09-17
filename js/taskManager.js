class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
        this.loadFromLocalStorage();
        this.setupEventListeners();
    }

    addTask(titulo, notas, fecha, importancia, persona) {
        this.currentId++;

        const task = {
            id: this.currentId,
            titulo: titulo,
            notas: notas,
            fecha: fecha,
            importancia: importancia,
            persona: persona,
            completed: false
        };

        this.tasks.push(task);
        this.renderTask(task);
        this.saveToLocalStorage();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        const elementoTarea = document.querySelector(`[data-id="${id}"]`);
        if (elementoTarea) {
            if (elementoTarea.nextElementSibling && elementoTarea.nextElementSibling.tagName === 'HR') {
                elementoTarea.nextElementSibling.remove();
            }
            elementoTarea.remove();
        }
        this.saveToLocalStorage();
    }

    toggleCompleteTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            const elementoTarea = document.querySelector(`[data-id="${id}"]`);
            if (elementoTarea) {
                const titulo = elementoTarea.querySelector('h5');
                if (task.completed) {
                    titulo.style.textDecoration = 'line-through';
                    elementoTarea.style.opacity = '0.6';
                } else {
                    titulo.style.textDecoration = 'none';
                    elementoTarea.style.opacity = '1';
                }
            }
            this.saveToLocalStorage();
        }
    }

    renderTask(task) {
        const contenedorTareas = document.querySelector('.tareas');
        if (!contenedorTareas) return;

        let badgeClases = "text-danger-emphasis bg-danger-subtle border-danger-subtle";
        if (task.importancia === 'Media') {
            badgeClases = "text-warning-emphasis bg-warning-subtle border-warning-subtle";
        } else if (task.importancia === 'Baja') {
            badgeClases = "text-success-emphasis bg-success-subtle border-success-subtle";
        }

        const estiliCompletado = task.completed ? 'text-decoration: line-through;' : '';
        const opacidadCompletado = task.completed ? 'opacity: 0.6;' : '';

        const tareaHTML = `
            <div class="p-3 border rounded d-flex align-items-center gap-3 tareaFondo" data-id="${task.id}" style="${opacidadCompletado}">
                <div id="tituloTaller" class="flex-grow-1">
                    <h5 style="${estiliCompletado}">${task.titulo}</h5>
                    <p class="mb-0">${task.notas}</p>
                </div>
                <span class="badge d-flex badge-fecha align-items-center justify-content-center py-3 ps-5 pe-5 border rounded-pill ${badgeClases}">
                    ${task.fecha}
                </span>
                <i class="bi bi-pencil-square btn-editar" style="cursor: pointer;"></i>
                <i class="bi bi-check2-square btn-completar" style="cursor: pointer;"></i>
                <i class="bi bi-trash3 btn-eliminar" style="cursor: pointer;"></i>
            </div>
            <hr>
        `;
        contenedorTareas.insertAdjacentHTML('beforeend', tareaHTML);
    }

    filtrarTareasPorPrioridad(prioridadSeleccionada) {
        const todasLasTarjetas = document.querySelectorAll('.tareaFondo');

        todasLasTarjetas.forEach(tarjeta => {
            const idTarjeta = parseInt(tarjeta.getAttribute('data-id'));
            const tareaBuscada = this.tasks.find(t => t.id === idTarjeta);
            const siguienteHr = tarjeta.nextElementSibling;

            if (tareaBuscada && tareaBuscada.importancia === prioridadSeleccionada) {
                tarjeta.style.setProperty('display', 'flex', 'important');
                if (siguienteHr && siguienteHr.tagName === 'HR') {
                    siguienteHr.style.setProperty('display', 'block', 'important');
                }
            } else {
                tarjeta.style.setProperty('display', 'none', 'important');
                if (siguienteHr && siguienteHr.tagName === 'HR') {
                    siguienteHr.style.setProperty('display', 'none', 'important');
                }
            }
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target;

            // Filtro desde badges superiores globales
            const botonGlobal = target.closest('.btn-filtro-global');
            if (botonGlobal) {
                const prioridad = botonGlobal.getAttribute('data-prioridad');
                this.filtrarTareasPorPrioridad(prioridad);
                return;
            }

            const tarjetaTarea = target.closest('.tareaFondo');
            if (tarjetaTarea) {
                const taskId = parseInt(tarjetaTarea.getAttribute('data-id'));

                // Filtro individual desde el badge de fecha/prioridad
                if (target.classList.contains('badge-fecha')) {
                    const tareaActual = this.tasks.find(t => t.id === taskId);
                    if (tareaActual) {
                        this.filtrarTareasPorPrioridad(tareaActual.importancia);
                    }
                    return;
                }

                // Lógica de eliminar
                if (target.classList.contains('bi-trash3') || target.classList.contains('btn-eliminar')) {
                    Swal.fire({
                        title: '¿Eliminar tarea?',
                        text: "Esta acción no se puede deshacer",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#6c757d',
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.deleteTask(taskId);
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon: 'success',
                                title: 'Tarea eliminada',
                                showConfirmButton: false,
                                timer: 2000
                            });
                        }
                    });
                }

                // Lógica de completar
                if (target.classList.contains('bi-check2-square') || target.classList.contains('btn-completar')) {
                    this.toggleCompleteTask(taskId);
                }

                // Lógica de editar (restaurada)
                if (target.classList.contains('bi-pencil-square') || target.classList.contains('btn-editar')) {
                    const task = this.tasks.find(t => t.id === taskId);
                    if (!task) return;

                    Swal.fire({
                        html: `
                            <form class="p-2 text-start" id="formularioModalEdit">
                                <div class="mb-3">
                                    <label class="form-label">Título</label>
                                    <input type="text" class="form-control" id="editTitulo" value="${task.titulo}">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Persona a cargo</label>
                                    <input type="text" class="form-control" id="editPersona" value="${task.persona}">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Importancia</label>
                                    <select class="form-select" id="editImportancia">
                                        <option value="Alta" ${task.importancia === 'Alta' ? 'selected' : ''}>Alta</option>
                                        <option value="Media" ${task.importancia === 'Media' ? 'selected' : ''}>Media</option>
                                        <option value="Baja" ${task.importancia === 'Baja' ? 'selected' : ''}>Baja</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Fecha</label>
                                    <input type="date" class="form-control" id="editFecha" value="${task.fecha}">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Notas</label>
                                    <textarea class="form-control" id="editNotas" rows="3">${task.notas}</textarea>
                                </div>
                            </form>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar Cambios',
                        cancelButtonText: 'Cancelar',
                        preConfirm: () => {
                            return {
                                titulo: document.getElementById('editTitulo').value,
                                persona: document.getElementById('editPersona').value,
                                importancia: document.getElementById('editImportancia').value,
                                fecha: document.getElementById('editFecha').value,
                                notas: document.getElementById('editNotas').value
                            };
                        }
                    }).then((res) => {
                        if (res.isConfirmed) {
                            Object.assign(task, res.value);
                            this.saveToLocalStorage();
                            const contenedor = document.querySelector('.tareas');
                            if (contenedor) {
                                contenedor.innerHTML = '';
                                this.tasks.forEach(t => this.renderTask(t));
                            }
                        }
                    });
                }
            }
        });

        // Doble clic para restablecer la vista de todas las tareas
        document.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('badge-fecha') || e.target.closest('.btn-filtro-global')) {
                const todasLasTarjetas = document.querySelectorAll('.tareaFondo');
                todasLasTarjetas.forEach(tarjeta => {
                    tarjeta.style.setProperty('display', 'flex', 'important');
                    const siguienteHr = tarjeta.nextElementSibling;
                    if (siguienteHr && siguienteHr.tagName === 'HR') {
                        siguienteHr.style.setProperty('display', 'block', 'important');
                    }
                });
            }
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('currentId', this.currentId.toString());
    }

    loadFromLocalStorage() {
        const tasksGuardadas = localStorage.getItem('tasks');
        const idGuardado = localStorage.getItem('currentId');

        if (tasksGuardadas) {
            this.tasks = JSON.parse(tasksGuardadas);
            this.currentId = parseInt(idGuardado) || 0;

            const renderAll = () => this.tasks.forEach(task => this.renderTask(task));

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', renderAll);
            } else {
                renderAll();
            }
        }
    }
}

const taskManager = new TaskManager();

// === LÓGICA NOTAS EXTRA ===

const btnNotaExtra = document.getElementById("btnNotaExtra");
const contenedorNotasExtras = document.getElementById("contenedorNotasExtras");

if (btnNotaExtra && contenedorNotasExtras) {
    btnNotaExtra.addEventListener("click", () => {
        Swal.fire({
            title: 'Nueva Nota Extra',
            html: `
                <div class="mb-3 text-start">
                    <label for="swal-extra-titulo" class="form-label">Título</label>
                    <input type="text" id="swal-extra-titulo" class="form-control" placeholder="Recordatorio">
                </div>
                <div class="mb-3 text-start">
                    <label for="swal-extra-contenido" class="form-label">Contenido</label>
                    <textarea id="swal-extra-contenido" class="form-control" rows="3" placeholder="Ingresa la informacion"></textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#198754',
            focusConfirm: false,
            preConfirm: () => {
                const titulo = document.getElementById('swal-extra-titulo').value.trim();
                const contenido = document.getElementById('swal-extra-contenido').value.trim();

                if (!titulo || !contenido) {
                    Swal.showValidationMessage('Por favor completa el título y el contenido');
                    return false;
                }

                return { titulo, contenido };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { titulo, contenido } = result.value;
                const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const diaActual = dias[new Date().getDay()];

                const nuevaNotaHTML = `
                    <div class="list-group-item backfondo border rounded p-2 lh-sm d-flex flex-column gap-2">
                        <div class="d-flex w-100 align-items-center justify-content-between">
                            <strong class="mb-1 text-truncate" style="max-width: 140px;">${titulo}</strong>
                            <small class="text-muted">${diaActual}</small>
                        </div>
                        <div class="small text-secondary">${contenido}</div>
                        
                        <div class="d-flex justify-content-end gap-2 border-top pt-2 mt-1">
                            <button class="btn btn-sm btn-outline-success p-1 px-2 btn-check-extra" title="Completar">
                                <i class="bi bi-check-lg"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-primary p-1 px-2 btn-edit-extra" title="Editar">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger p-1 px-2 btn-delete-extra" title="Eliminar">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </div>
                `;

                contenedorNotasExtras.insertAdjacentHTML('afterbegin', nuevaNotaHTML);

                Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                }).fire({
                    icon: "success",
                    title: "Nota extra agregada"
                });
            }
        });
    });
}

if (contenedorNotasExtras) {
    contenedorNotasExtras.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('button');
        if (!targetBtn) return;

        const tarjetaNota = targetBtn.closest('.list-group-item');

        if (targetBtn.classList.contains('btn-check-extra')) {
            tarjetaNota.classList.toggle('text-decoration-line-through');
            tarjetaNota.classList.toggle('opacity-50');
        }

        if (targetBtn.classList.contains('btn-delete-extra')) {
            Swal.fire({
                title: '¿Eliminar nota?',
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, borrar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    tarjetaNota.remove();
                }
            });
        }

        if (targetBtn.classList.contains('btn-edit-extra')) {
            const tituloEl = tarjetaNota.querySelector('strong');
            const contenidoEl = tarjetaNota.querySelector('.small');

            Swal.fire({
                title: 'Editar Nota Extra',
                html: `
                    <input id="swal-edit-titulo" class="swal2-input" value="${tituloEl.textContent}" placeholder="Nota">
                    <textarea id="swal-edit-contenido" class="swal2-textarea" placeholder="Informacion">${contenidoEl.textContent}</textarea>
                `,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    return {
                        titulo: document.getElementById('swal-edit-titulo').value,
                        contenido: document.getElementById('swal-edit-contenido').value
                    }
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    tituloEl.textContent = result.value.titulo;
                    contenidoEl.textContent = result.value.contenido;
                }
            });
        }
    });
}