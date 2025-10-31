let listaObraSociales = JSON.parse(localStorage.getItem("listaObraSociales")) || [];

//Listar obras sociales
function listarObraSocial(){
    contadorDeObraSocial();

    let tablaObrasSociales = document.getElementById('tablaObrasSociales');
    tablaObrasSociales.innerHTML = "";

    listaObraSociales.forEach((obrasocial) => {
        //Para cada especialidad se creará una nueva fila
        let fila = document.createElement('tr');
        fila.style.textAlign = "center"; 

        //para cada fila se creará su contenido
        let idfila = document.createElement('td');
        idfila.textContent = obrasocial.id;

        let nombrefila = document.createElement('td');
       nombrefila.innerHTML = obrasocial.nombre;

        //los botones de borrar, editar y visualizar
        let botones = document.createElement('td');

        let div = document.createElement('div');
        div.classList.add("d-flex", "flex-column", "flex-lg-row","justify-content-center", "gap-2", "acciones");
        
        let botonEliminar = document.createElement('button');
        botonEliminar.classList.add("btn", "btn-outline");
        botonEliminar.innerHTML = '<i class="bi bi-trash"></i>';
        botonEliminar.addEventListener('click', function(){
            eliminarObrasocial(obrasocial.id);
        })

        let botonEditar = document.createElement('button');
        botonEditar.classList.add("btn", "btn-outline");
        botonEditar.innerHTML = ' <i class="bi bi-pencil-square"></i>';
        botonEditar.addEventListener('click', function(){
            editarObraSocial(obrasocial.id);

        })

        let botonVisualizar = document.createElement('button');
        botonVisualizar.classList.add("btn", "btn-outline");
        botonVisualizar.innerHTML = '<i class="bi bi-eye"></i>';
        botonVisualizar.addEventListener('click', function(){
            visualizarObraSocial(obrasocial.id);
        })

        div.appendChild(botonEliminar);
        div.appendChild(botonEditar);
        div.appendChild(botonVisualizar);
        fila.appendChild(idfila);
        fila.appendChild(nombrefila);
        botones.appendChild(div);
        fila.appendChild(botones);
        tablaObrasSociales.appendChild(fila);

        
    });
    
}listarObraSocial();

/*ELIMINAR ESPECIALIDAD*/
function eliminarObrasocial(idEspecialidadAEliminar){
    especialidadSeleccionada = listaObraSociales.find((p) => p.id === idEspecialidadAEliminar);

    if(confirm(`¿Esta seguro que quiere eliminar ${especialidadSeleccionada.nombre} de la lista especialidades?`)){
        especialidades = listaObraSociales.filter(especialidad => especialidad.id !== especialidadSeleccionada.id);

        localStorage.setItem("especialidades", JSON.stringify(especialidades));
        listarObraSocial();
        location.reload();
    }
};


/*MODIFICAR DATOS DE UNA ESPECIALIDAD*/
//Definir variables
const nombreModificar= document.getElementById('nombreModificar');
const mensajeError = document.getElementById('mensajeError');
const descripcionModificar= document.getElementById('descripcionModificar');
let obraSocialSeleccionadaModificar = null;
let obraSocialModificarActual = null;

function editarObraSocial(idObraSocialAEditar){
    //buscar la especialidad en la lista
    obraSocialSeleccionadaModificar = listaObraSociales.find((p) => p.id === idObraSocialAEditar);
    console.log(obraSocialSeleccionadaModificar);

    document.getElementById('vista-formulario-modificar').classList.remove('d-none');

    nombreModificar.value = obraSocialSeleccionadaModificar.nombre;
    descripcionModificar.value= obraSocialSeleccionadaModificar.descripcion;

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

        if(!/^[a-zA-ZÀ-ÿ]{2,50}(?: [a-zA-Z]{2,50})*$/.test(nombreModificar.value)){
            warning+='*Nombre inválido<br>';
            console.log('nombre error');
            erroresEncontrados = true;
        }
        if(!descripcionModificar.value){
            warning+= '*agregue una descripción';
            console.log('descripcion inválida');
            erroresEncontrados = true;
        }

        if(erroresEncontrados){
            mensajeError.innerHTML=warning;
            return;
        }
        

        obraSocialSeleccionadaModificar.nombre = nombreModificar.value;
        obraSocialSeleccionadaModificar.descripcion = descripcionModificar.value;

        localStorage.setItem("listaObraSociales", JSON.stringify(listaObraSociales));

        console.clear();
        // console.log('Datos actualizados');

        //reseteamos el formulario
        document.getElementById('formulario-modificar').reset();

        //actualizamos la lista
        listarObraSocial();
        alert('✅ Datos actualizados correctamente');
        botonCerrar(vistaDelFormulario);
        
    });
}



/*VISUALIZAR ESPECIALIDAD*/
//Definir variables
let especialidadActual = null;

let vistaDeTarjetaProfesional = document.getElementById('card-vista');
const nombreVista= document.getElementById('vista-nombre');
const descripcionVista= document.getElementById('vista-descripcion');

function visualizarObraSocial(idEspecialidadAVisualizar){
    obraSocialSeleccionada = listaObraSociales.find((p) => p.id === idEspecialidadAVisualizar);
    console.log(obraSocialSeleccionada);

    vistaDeTarjetaProfesional.classList.remove('d-none');
    if(especialidadActual !== obraSocialSeleccionada.id){
        
        especialidadActual = obraSocialSeleccionada.id;
        // console.log(especialidadActual);

        nombreVista.innerHTML =obraSocialSeleccionada.nombre;
        descripcionVista.innerHTML = obraSocialSeleccionada.descripcion;
    }

};


function contadorDeObraSocial(){
    let total = document.getElementById('totalObraSocial');
    if (listaObraSociales.length == 1){
        total.innerHTML = 'Total ' + listaObraSociales.length + ' obra social';
    } else{
        total.innerHTML = 'Total ' + listaObraSociales.length + ' obras sociales' ;
    }
}

function botonCerrar(elemento){
    if(elemento.classList.contains('d-flex')){
        elemento.classList.add('d-none');
    }
};

//el formulario esta oculto y solo será visible cuandos sea seleccionado
let vistaDelFormulario = document.getElementById('vista-formulario-modificar');