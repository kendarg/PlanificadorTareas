document.addEventListener('DOMContentLoaded', () =>{

    const contenerTareas = document.querySelector('.tareas');

    if(!contenerTareas) return;
    
    contenerTareas.addEventListener('click', (e) =>{
        const target = e.target;

        if(target.classList.contains('bi-trash3')){
            const tareaCard = target.closest('.tareaFondo');
            const Siguiente = tareaCard.nextElementSibling;
            Swal.fire({
                title: '¿Estas seguro de borar?',
                text: 'Recuerda que esto borrara la tarea y No se podra revertir',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff2a00',
                cancelButtonColor: '#80888f',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'
            }).then((result) =>{
                if(result.isConfirmed){
                    if(Siguiente && Siguiente.tagName === 'HR'){
                        Siguiente.remove();
                    }
                    tareaCard.remove();
                    Swal.fire('Elimindao', 'La tarea ha sido eliminda', 'success');
                }
        });
    };
    if(target.classList.contains('bi-check2-square')){
        const tareaCard = target.closest('.tareaFondo');
        const titulo = tareaCard.querySelector('#tituloTaller h5');
        const descripcion = tareaCard.querySelector('#tituloTaller p');
        const estaCompletada = tareaCard.classList.toggle('opacity-50');
        if(estaCompletada){
            titulo.style.textDecoration = 'line-through';
            descripcion.style.textDecoration = 'line-through';
            target.classList.replace('bi-check2-square', 'bi-check2-square-fill');
        }else{
            titulo.style.textDecoration = 'none';
            descripcion.style.textDecoration = 'none';
            target.classList.replace('bi-check2-square-fill', 'bi-check2-square');
        };
    };
    if(target.classList.contains('bi-pencil-square')){
        const tareaCard = target.closest('.tareaFondo');
        const tituloEl = tareaCard.querySelector('#tituloTaller h5');
        const descripcionEl = tareaCard.querySelector('#tituloTaller p');

        Swal.fire({
            title: 'Editar Tarea',
            html:` <div class="text-start mb-2">
                        <label class="form-label fw-bold">Título</label>
                        <input id="swal-input-titulo" class="form-control" value="${tituloEl.innerText}">
                    </div>
                    <div class="text-start">
                        <label class="form-label fw-bold">Descripción</label>
                        <textarea id="swal-input-desc" class="form-control" rows="3">${descripcionEl.innerText}</textarea>
                    </div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            
            preConfirm: () =>{
                const nuevoTitulo = document.getElementById('swal-input-titulo').value.trim();
                const nuevaDesc = document.getElementById('swal-input-desc').value.trim();

                if(!nuevoTitulo){
                    Swal.showValidationMessage('El tituo no puede estar vacio');
                    return false;
                };
                return{ titulo: nuevoTitulo, descripcion: nuevaDesc };
            }
        }).then((result) =>{
            if(result.isConfirmed){
                tituloEl.innerText = result.value.titulo;
                descripcionEl.innerText = result.value.descripcion;
                Swal.fire('Actualizado','La tarea se a actualizado correctamente', 'success');
            }
        });
    };
    });



});