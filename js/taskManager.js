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
        // Filtrar array y eliminar del DOM
        this.tasks = this.tasks.filter(task => task.id !== id);
        const elementoTarea = document.querySelector(`[data-id="${id}"]`);
        if (elementoTarea) {
            // Eliminar elemento y la línea <hr> adyacente si existe
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
                <span class="badge d-flex flex-fill align-items-center justify-content-center py-3 ps-5 pe-5 border rounded-pill ${badgeClases}">
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

    setupEventListeners() {
        // Escucha eventos en toda la sección de tareas (Delegación de Eventos)
        document.addEventListener('click', (e) => {
            const target = e.target;
            const tarjetaTarea = target.closest('.tareaFondo');
            if (!tarjetaTarea) return;

            const taskId = parseInt(tarjetaTarea.getAttribute('data-id'));

            // Acción: Eliminar Tarea
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

            // Acción: Marcar Completada
            if (target.classList.contains('bi-check2-square') || target.classList.contains('btn-completar')) {
                this.toggleCompleteTask(taskId);
            }

            // Acción: Editar Tarea
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
                        // Actualizar datos
                        Object.assign(task, res.value);
                        this.saveToLocalStorage();
                        // Recargar la lista en pantalla
                        const contenedor = document.querySelector('.tareas');
                        if (contenedor) {
                            // Limpiar y re-renderizar todas
                            const items = contenedor.querySelectorAll('.tareaFondo, hr');
                            items.forEach(el => el.remove());
                            this.tasks.forEach(t => this.renderTask(t));
                        }
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

            document.addEventListener('DOMContentLoaded', () => {
                this.tasks.forEach(task => this.renderTask(task));
            });
        }
    }
}

const taskManager = new TaskManager();