const btnNuevaTarea = document.querySelector("#btnNuevaTarea");

btnNuevaTarea.addEventListener("click", () =>{
Swal.fire({
    html:`
        <form class="p-2 text-start" id="formularioModal">
            <div class="mb-3">
                <label for="tituloInput" class="form-label">Título</label>
                <input type="text" class="form-control" id="tituloInput" placeholder="Proyecto Web">
            </div>
            <div class="mb-3">
                <label for="personaInput" class="form-label">Persona a cargo</label>
                <input type="text" class="form-control" id="personaInput" placeholder="Ken">
            </div>
            <div class="mb-3">
                <label for="importanciaInput" class="form-label">Importancia</label>
                <select class="form-select" id="importanciaInput">
                    <option selected value="">Seleccionar...</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="fechaInput" class="form-label">Fecha</label>
                <input type="date" class="form-control" id="fechaInput">
            </div>
            <div class="mb-3">
                <label for="notasInput" class="form-label">Notas</label>
                <textarea class="form-control" id="notasInput" rows="3" placeholder="Hacer Proyecto"></textarea>
            </div>
        </form>
    `,
    showCancelButton : true,
    confirmButtonText: 'Agregar',
    cancelButtonText:'Cancelar',
    confirmButtonColor: '#0d6efd',
    focusConfirm: false,

    preConfirm: () =>{
        const titulo = Swal.getPopup().querySelector("#tituloInput");
        const persona = Swal.getPopup().querySelector("#personaInput");
        const importancia = Swal.getPopup().querySelector("#importanciaInput");
        const fecha = Swal.getPopup().querySelector("#fechaInput");
        const notas = Swal.getPopup().querySelector("#notasInput");
        const campos =[titulo,persona,importancia,fecha,notas];
        let formularioValido = true;

        campos.forEach(campo =>{
            if(!campo.value.trim()){
                campo.classList.add('is-invalid');
                formularioValido = false;
            }else{
                campo.classList.remove('is-invalid');
                campo.classList.add('is-valid');
            }
        });
        if(!formularioValido){
            Swal.showValidationMessage('Porfavor diligenciar Todos los campos obligatorios');
            return false;
        }
        return{
            titulo: titulo.value,
            persona: persona.value,
            importancia: importancia.value,
            fecha: fecha.value,
            notas: notas.value
        };
    }
    }).then((resultado)=>{
        if(resultado.isConfirmed){
            const datosTarea = resultado.value;
            Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            }).fire({
                icon: "success",
                title: `Tarea "${datosTarea.titulo}" Se a Agregado`
            });
            console.log("Prueva de que si se esta mandando esto", datosTarea);
            
        }
    });

});
