import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar } from "./utils.js";
let especialidades = obtenerDatos("especialidades");
let medicos = obtenerDatos("medicos");

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
    let especialidadSeleccionada = especialidades.find((p) => p.id === idEspecialidadAEliminar);
    let existenMedicos = medicos.filter(medico => medico.especialidad === especialidadSeleccionada.id);

    if(existenMedicos.length===0){
        if(confirm(`❌ ¿Esta seguro que quiere eliminar ${especialidadSeleccionada.nombre} de la lista especialidades?`)){
            especialidades = especialidades.filter(especialidad => especialidad.id !== especialidadSeleccionada.id);
            guardarDatos("especialidades", especialidades);
            listarEspecialidades();
            location.reload();
        }
    }
    else{
        alert(`🚫 No es posible eliminar ${especialidadSeleccionada.nombre} porque hay ${existenMedicos.length} medico(s) con esa especialidad.`);
        
    }
};


/*MODIFICAR DATOS DE UNA ESPECIALIDAD*/
//Definir variables
const nombreModificar= document.getElementById('nombreModificar');
const mensajeError = document.getElementById('mensajeError');
let especialidadSeleccionadaModificar = null;
let vistaDelFormulario = document.getElementById('vista-formulario-modificar');

function editarEspecialidad(idEspecialidadAEditar){
    //buscar la especialidad
    especialidadSeleccionadaModificar = especialidades.find((p) => p.id === idEspecialidadAEditar);
    console.log(especialidadSeleccionadaModificar);

    vistaDelFormulario.classList.remove('d-none');
    nombreModificar.value = especialidadSeleccionadaModificar.nombre;

};
if(document.getElementById('formulario-modificar')){

    document.getElementById('formulario-modificar').addEventListener('submit', evento =>{
        evento.preventDefault();

        //si hay cambios se verifican si son correctos
        let warning = "";
        let erroresEncontrados = false;
        mensajeError.innerHTML = "";

        if(!/^[a-zA-ZÀ-ÿ]{2,50}(?: [a-zA-Z]{2,50})*$/.test(nombreModificar.value)){
            warning+='*Nombre inválido<br>';
            console.log('nombre error');
            erroresEncontrados = true;
        }

        if(erroresEncontrados){
            mensajeError.innerHTML=warning;
            return;
        }
        

        especialidadSeleccionadaModificar.nombre = nombreModificar.value;
        guardarDatos("especialidades", especialidades);
        console.clear();
        // console.log('Datos actualizados');

        //reseteamos el formulario y actualizamos la lista
        document.getElementById('formulario-modificar').reset();
        listarEspecialidades();
        alert('✅ Datos actualizados correctamente');
        botonCerrar('vista-formulario-modificar');
        
    });
}



/*VISUALIZAR ESPECIALIDAD*/
//Definir variables
let especialidadActual = null;
let vistaDeTarjetaProfesional = document.getElementById('card-vista');
const nombreVista= document.getElementById('vista-nombre');

function visualizarEspecialidad(idEspecialidadAVisualizar){
    let especialidadSeleccionado = especialidades.find((p) => p.id === idEspecialidadAVisualizar);
    console.log(especialidadSeleccionado);

    vistaDeTarjetaProfesional.classList.remove('d-none');
    if(especialidadActual !== especialidadSeleccionado.id){
        
        especialidadActual = especialidadSeleccionado.id;
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

document.querySelectorAll('.botonCerrar').forEach(boton=>{
    boton.addEventListener('click', ()=>{
        const targetId = boton.dataset.target;
        botonCerrar(targetId);
        
    })
});

