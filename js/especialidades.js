let especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];

//LIstar especialidades
function listarEspecialidades(){
    contadorDeEspecialidades();

    let tablaEspecialidades = document.getElementById('tablaEspecialidades');
    tablaEspecialidades.innerHTML = "";

    especialidades.forEach((especialidad) => {
        //Para cada especialidad se creará una nueva fila
        let fila = document.createElement('tr');
        fila.style.textAlign = "center"; 

        //para cada fila se creará su contenido
        let idfila = document.createElement('td');
        idfila.textContent = especialidad.id;

        let nombrefila = document.createElement('td');
       nombrefila.innerHTML = especialidad.nombre;

        //los botones de borrar, editar y visualizar
        let botones = document.createElement('td');

        let div = document.createElement('div');
        div.classList.add("d-flex", "flex-column", "flex-lg-row","justify-content-center", "gap-2", "acciones");
        
        let botonEliminar = document.createElement('button');
        botonEliminar.classList.add("btn", "btn-outline");
        botonEliminar.innerHTML = '<i class="bi bi-trash"></i>';
        botonEliminar.addEventListener('click', function(){
            eliminarEspecialidad(especialidad.id);
        })

        let botonEditar = document.createElement('button');
        botonEditar.classList.add("btn", "btn-outline");
        botonEditar.innerHTML = ' <i class="bi bi-pencil-square"></i>';
        botonEditar.addEventListener('click', function(){
            editarEspecialidad(especialidad.id);

        })

        let botonVisualizar = document.createElement('button');
        botonVisualizar.classList.add("btn", "btn-outline");
        botonVisualizar.innerHTML = '<i class="bi bi-eye"></i>';
        botonVisualizar.addEventListener('click', function(){
            visualizarEspecialidad(especialidad.id);
        })

        div.appendChild(botonEliminar);
        div.appendChild(botonEditar);
        div.appendChild(botonVisualizar);
        fila.appendChild(idfila);
        fila.appendChild(nombrefila);
        botones.appendChild(div);
        fila.appendChild(botones);
        tablaEspecialidades.appendChild(fila);

        
    });
    
}listarEspecialidades();

/*ELIMINAR ESPECIALIDAD*/
function eliminarEspecialidad(idEspecialidadAEliminar){
    especialidadSeleccionada = especialidades.find((p) => p.id === idEspecialidadAEliminar);


    if(confirm(`¿Esta seguro que quiere eliminar ${especialidadSeleccionada.nombre} de la lista especialidades?`)){
        especialidades = especialidades.filter(especialidad => especialidad.id !== especialidadSeleccionada.id);

        localStorage.setItem("especialidades", JSON.stringify(especialidades));
        listarEspecialidades();
        location.reload();

    }
};


/*MODIFICAR DATOS DE UNA ESPECIALIDAD*/
//Definir variables
const nombreModificar= document.getElementById('nombreModificar');
const mensajeError = document.getElementById('mensajeError');
const labelError = document.querySelector('label[for="nombre"]');
let especialidadSeleccionadaModificar = null;
let especialidadModificarActual = null;

function editarEspecialidad(idEspecialidadAEditar){
    //buscar la especialidad en la lista
    especialidadSeleccionadaModificar = especialidades.find((p) => p.id === idEspecialidadAEditar);
    console.log(especialidadSeleccionadaModificar);

    document.getElementById('vista-formulario-modificar').classList.remove('d-none');

    if(especialidadModificarActual !== especialidadSeleccionadaModificar.id){
        especialidadModificarActual = especialidadSeleccionadaModificar.id;
        //se traen los datos de la especialidad
        nombreModificar.value = especialidadSeleccionadaModificar.nombre;
    }

};
if(document.getElementById('formulario-modificar')){

    document.getElementById('formulario-modificar').addEventListener('submit', evento =>{
        evento.preventDefault();

        //si hay cambios se verifican si son correctos
        let warning = "";
        let erroresEncontrados = false;
        // console.log('Error al enviar formulario:');

        //limpiar mensaje error
        mensajeError.innerHTML = "";
        labelError.classList.remove('text-danger');

        if(!/^[a-zA-ZÀ-ÿ]{2,50}(?: [a-zA-Z]{2,50})*$/.test(nombreModificar.value)){
            warning+='*Nombre inválido<br>';
            console.log('nombre error');
            erroresEncontrados = true;
        }

        if(erroresEncontrados){
            mensajeError.innerHTML=warning;
            labelError.classList.add('text-danger');
            return;
        }
        

        especialidadSeleccionadaModificar.nombre = nombreModificar.value;

        localStorage.setItem("especialidades", JSON.stringify(especialidades));

        console.clear();
        // console.log('Datos actualizados');

        //reseteamos el formulario
        document.getElementById('formulario-modificar').reset();

        //actualizamos la lista
        listarEspecialidades();
        alert('✅ Datos actualizados correctamente');
        botonCerrar(vistaDelFormulario);
        
    });
}



/*VISUALIZAR ESPECIALIDAD*/
//Definir variables
let especialidadActual = null;

let vistaDeTarjetaProfesional = document.getElementById('card-vista');
const nombreVista= document.getElementById('vista-nombre');

function visualizarEspecialidad(idEspecialidadAVisualizar){
    especialidadSeleccionado = especialidades.find((p) => p.id === idEspecialidadAVisualizar);
    console.log(especialidadSeleccionado);

    vistaDeTarjetaProfesional.classList.remove('d-none');
    if(especialidadActual !== especialidadSeleccionado.id){
        
        especialidadActual = especialidadSeleccionado.id;
        // console.log(especialidadActual);

        nombreVista.innerHTML =especialidadSeleccionado.nombre;
    }

};


function contadorDeEspecialidades(){
    let total = document.getElementById('totalEspecialidades');
    if (especialidades.length == 1){
        total.innerHTML = 'Total ' + especialidades.length + ' especialidad';
    } else{
        total.innerHTML = 'Total ' + especialidades.length + ' especialidades' ;
    }
}

function botonCerrar(elemento){
    if(elemento.classList.contains('d-flex')){
        elemento.classList.add('d-none');
    }
};

//el formulario esta oculto y solo será visible cuandos sea seleccionado
let vistaDelFormulario = document.getElementById('vista-formulario-modificar');