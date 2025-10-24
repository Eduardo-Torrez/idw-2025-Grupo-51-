
let lista = JSON.parse(localStorage.getItem("lista")) || [];

//LISTAR PROFESIONALES
function listarProfesionales(){
    
    contadorDeProfesioanles();
    let tablaProfesionales = document.getElementById('tablaProfesionales');
        
    //Limpiar contenido previo de la tabla
    tablaProfesionales.innerHTML = '';

    lista.forEach((medico) => {
        //Para cada médico se creará una nueva fila
        let fila = document.createElement('tr');
        fila.style.textAlign = "center"; 

        //para cada fila se creará su contenido
        let idfila = document.createElement('td');
        idfila.textContent = medico.id;

        let nombreyapellido = document.createElement('td');
        nombreyapellido.innerHTML = medico.nombre + ' ' + medico.apellido;

        let especialidad = document.createElement('td');
        especialidad.textContent= medico.especialidad;

        let matricula = document.createElement('td');
        matricula.textContent= medico.matricula;

        let valorConsulta = document.createElement('td');
        valorConsulta.textContent= medico.valorConsulta;

        let obrasSociales = document.createElement('td');
        obrasSociales.textContent=medico.obraSociales;

        let botones = document.createElement('td');

        //crear los botones de borrar, editar y visualizar
        let div = document.createElement('div');
        div.classList.add("d-flex", "flex-column", "flex-lg-row", "gap-2", "acciones");
        
        let botonEliminar = document.createElement('button');
        botonEliminar.classList.add("btn", "btn-outline");
        botonEliminar.innerHTML = '<i class="bi bi-trash"></i>';
        botonEliminar.addEventListener('click', function(){
            eliminarProfesional(medico.id);
        })

        let botonEditar = document.createElement('button');
        botonEditar.classList.add("btn", "btn-outline");
        botonEditar.innerHTML = ' <i class="bi bi-pencil-square"></i>';
        botonEditar.addEventListener('click', function(){
            vistaDelFormulario.classList.remove('d-none');
            // editarProfesional(medico.id);
        })

        let botonVisualizar = document.createElement('button');
        botonVisualizar.classList.add("btn", "btn-outline");
        botonVisualizar.innerHTML = '<i class="bi bi-eye"></i>';
        botonVisualizar.addEventListener('click', function(){
            visualizarProfesional(medico.id);
        })


        div.appendChild(botonEliminar);
        div.appendChild(botonEditar);
        div.appendChild(botonVisualizar);
        fila.appendChild(idfila);
        fila.appendChild(nombreyapellido);
        fila.appendChild(especialidad);
        fila.appendChild(matricula);
        fila.appendChild(valorConsulta);
        fila.appendChild(obrasSociales);
        botones.appendChild(div);
        fila.appendChild(botones);
        tablaProfesionales.appendChild(fila);
    })

}listarProfesionales();


/*se busca el profesional en la lista
se crea una nueva lista excluyendo al profesional seleccionado
se guarda la nueva lista en localstorage
se actualiza la tabla
y se actualiza localstorage
*/
function eliminarProfesional(idDelProfesionalAEliminar){
    profesionalSeleccionado = lista.find((p) => p.id === idDelProfesionalAEliminar);
    // console.log(profesionalSeleccionado);

    if(confirm(`¿Esta seguro que quiere eliminar a ${profesionalSeleccionado.nombre} ${profesionalSeleccionado.apellido} de la lista de profesionales?`)){
        lista = lista.filter(profesional => profesional.id !== profesionalSeleccionado.id);

        localStorage.setItem("lista", JSON.stringify(lista));
        listarProfesionales();
        location.reload();

    }
};


//Definir variables
let profesionalActual = null;

let vistaDeTarjetaProfesional = document.getElementById('card-vista');
const matriculaVista= document.getElementById('vista-matricula');
const nombreVista= document.getElementById('vista-nombre');
const especialidadVista= document.getElementById('vista-especialidad');
const descripcionVista= document.getElementById('vista-descripcion');
const obrasSocialesVista= document.getElementById('vista-obrasocial');
const fotografiaVista= document.getElementById('vista-foto');
const valorConsultavista= document.getElementById('vista-valorconsulta');

function visualizarProfesional(idDelProfesionalAVisualizar){
    profesionalSeleccionado = lista.find((p) => p.id === idDelProfesionalAVisualizar);
    console.log(profesionalSeleccionado);

    console.log('actual:'+profesionalActual);
    console.log('selec:'+profesionalSeleccionado.id);

    vistaDeTarjetaProfesional.classList.remove('d-none');
    if(profesionalActual !== profesionalSeleccionado.id){
        
        profesionalActual = profesionalSeleccionado.id;
        console.log('se cambio');
        console.log(profesionalActual);

        matriculaVista.innerHTML = profesionalSeleccionado.matricula;
        nombreVista.innerHTML = profesionalSeleccionado.nombre + ' ' + profesionalSeleccionado.apellido;
        especialidadVista.innerHTML = profesionalSeleccionado.especialidad;
        obrasSocialesVista.innerHTML = profesionalSeleccionado.obraSociales;
        valorConsultavista.innerHTML = profesionalSeleccionado.valorConsulta;
        descripcionVista.innerHTML = profesionalSeleccionado.descripcion;
        fotografiaVista.src = profesionalSeleccionado.fotografia

    }

};


/*división de responsabilidades: separamos las acciones en funciones
No es una buena pratica, que una función haga todo*/
function contadorDeProfesioanles(){
    let total = document.getElementById('totalProfesionales');
    if (lista.length == 1){
        total.innerHTML = 'Total ' + lista.length + ' profesional';
    } else{
        total.innerHTML = 'Total ' + lista.length + ' profesionales' ;
    }
}contadorDeProfesioanles();

function botonCerrar(elemento){
    if(elemento.classList.contains('d-flex')){
        elemento.classList.add('d-none');
    }
};

//el formulario esta oculto y solo será visible cuandos sea seleccionado
let vistaDelFormulario = document.getElementById('vista-formulario-modificar');