class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
        this.loadFromLocalStorage();
    }

    addTask(titulo, notas, fecha, importancia, persona) {
        this.currentId++;

        const task = {
            id: this.currentId,
            titulo: titulo,
            notas: notas,
            fecha: fecha,
            importancia: importancia,
            persona: persona
        };

        this.tasks.push(task);
        this.renderTask(task);
        this.saveToLocalStorage();
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

        // Crear la estructura HTML idéntica a tu tarjeta
        const tareaHTML = `
            <div class="p-3 border rounded d-flex align-items-center gap-3 tareaFondo" data-id="${task.id}">
                <div id="tituloTaller" class="flex-grow-1">
                    <h5>${task.titulo}</h5>
                    <p class="mb-0">${task.notas}</p>
                </div>
                <span class="badge d-flex flex-fill align-items-center justify-content-center py-3 ps-5 pe-5 border rounded-pill ${badgeClases}">
                    ${task.fecha}
                </span>
                <i class="bi bi-pencil-square" style="cursor: pointer;"></i>
                <i class="bi bi-check2-square" style="cursor: pointer;"></i>
                <i class="bi bi-trash3" style="cursor: pointer;"></i>
            </div>
            <hr>
        `;
        contenedorTareas.insertAdjacentHTML('beforeend', tareaHTML);
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