/*Almacenar los datos del localstorage y si no hay se crea un array vacio*/
let lista = JSON.parse(localStorage.getItem("lista")) || [];

//LISTAR PROFESIONALES
function listarProfesionales(){
    
    contadorDeProfesioanles();
    let tablaProfesionales = document.getElementById('tablaProfesionales');
        
    //Limpiar contenido previo de la tabla
    tablaProfesionales.innerHTML = '';

    lista.forEach((medico) => {
        let fila = document.createElement('tr');
        fila.style.textAlign = "center";

        fila.innerHTML =
        '<td>' + medico.id + '</td>' +
        '<td>' + medico.nombre + ' ' + medico.apellido +'</td>' +
        '<td>' + medico.especialidad + '</td>' +
        '<td>' + medico.matricula + '</td>' +
        '<td>' + medico.valorConsulta + '</td>' +
        '<td>' + medico.obraSociales + '</td>' +
        '<td>'+ `<div class="d-flex flex-column flex-lg-row gap-2 acciones">
                    <button type="button" class="btn btn-outline boton-eliminar" data-id="${medico.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button type="button" class="btn btn-outline" boton-editar" data-id="${medico.id}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button type="button" class="btn btn-outline" boton-visualizar" data-id="${medico.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>`
        +'</td>';


        //se crea la fila con el contenido del médico y se agrega a la tabla
        console.log('fila: ' + medico);
        tablaProfesionales.appendChild(fila);
    })

    //BOTON ELIMINAR
    let botonEliminar = document.getElementsByClassName('boton-eliminar');
    for (let boton of botonEliminar){
        boton.addEventListener('click', function(){
            let idDelProfesionalAEliminar = this.getAttribute('data-id');
            eliminarProfesional(idDelProfesionalAEliminar);
        })
    }

    //BOTON EDITAR
    let botonEditar = document.getElementsByClassName('boton-editar');
    for (let boton of botonEliminar){
        boton.addEventListener('click', function(){
            let idDelProfesionalAEliminar = this.getAttribute('data-id');
            eliminarProfesional(idDelProfesionalAEditar);
        })
    }

    //BOTON VISUALIZAR
    let botonVisualizar = document.getElementsByClassName('boton-visualizar');
    for (let boton of botonEliminar){
        boton.addEventListener('click', function(){
            let idDelProfesionalAEliminar = this.getAttribute('data-id');
            eliminarProfesional(idDelProfesionalAVisualizar);
        })
    }

}listarProfesionales();


function eliminarProfesional(idMedico){
    console.log(idMedico);
    profesionalSeleccionado = lista.find((p) => p.id === idMedico);
    console.log(profesionalSeleccionado);

    if(confirm(`¿Esta seguro que quiere eliminar a ${profesionalSeleccionado.nombre} ${profesionalSeleccionado.apellido} de la lista de profesionales?`)){
        lista = lista.filter(profesional => profesional.id !== profesionalSeleccionado.id);

        localStorage.setItem("lista", JSON.stringify(lista));
        listarProfesionales();
        location.reload();

    }
    
};


//el formulario esta oculto y solo será visible cuandos ea seleccioando
let vistaDelFormulario = document.getElementById('vista-formulario-modificar');
vistaDelFormulario.style.display = 'none';

function editarProfesional(idMedico){
    vistaDelFormulario.classList.add('d-flex');
};



function contadorDeProfesioanles(){
    let total = document.getElementById('totalProfesionales');
    if (lista.length == 1){
        total.innerHTML = 'Total ' + lista.length + ' profesional';
    } else{
        total.innerHTML = 'Total ' + lista.length + ' profesionales' ;
    }
}contadorDeProfesioanles();