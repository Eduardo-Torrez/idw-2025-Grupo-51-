import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar, visualizarForm, generarId } from "./utils.js";
let listaObraSociales = obtenerDatos("listaObraSociales");

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

        let porcentajefila = document.createElement('td');
       porcentajefila.innerHTML = obrasocial.porcentajeDescuento;

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
        fila.appendChild(porcentajefila);
        botones.appendChild(div);
        fila.appendChild(botones);
        tablaObrasSociales.appendChild(fila);
    });
    
}listarObraSocial();

/*ELIMINAR OBRA SOCIAL*/
function eliminarObrasocial(idAEliminar){

    let obrasocialSelecionada = listaObraSociales.find((obso) => obso.id === idAEliminar);

    if(confirm(`❌ ¿Esta seguro que quiere eliminar ${obrasocialSelecionada.nombre} de la lista obras sociales?`)){
        listaObraSociales = listaObraSociales.filter(obrasocial => obrasocial.id !== obrasocialSelecionada.id);
        guardarDatos("listaObraSociales", listaObraSociales);
        listarObraSocial();
        location.reload();
    }
};



//Definir variables
const crearObraSocial = document.getElementById('crearObraSocial');
const nombreModificar= document.getElementById('nombre');
const descripcionModificar= document.getElementById('descripcion');
const porcentajeModificar = document.getElementById('porcentaje');
const mensajeError = document.getElementById('mensajeError');
let obraSocialSeleccionada = null;
let vistaDelFormulario = document.getElementById('vista-formulario');


/*CREAR OBRA SOCIAL*/
crearObraSocial.addEventListener('click', ()=>{
    let nuevaObraSocial = {}
    let id = generarId(listaObraSociales);
    nuevaObraSocial = {
        'id':id, 
        'nombre': nombreModificar.value,
        'porcentajeDescuento': porcentajeModificar.value,
        'descripcion': descripcionModificar.value
    };
    // console.log(nuevaObraSocial);
    obraSocialSeleccionada = nuevaObraSocial;

    visualizarForm('Crear obra social', vistaDelFormulario, formulario, mensajeError);
})


/*MODIFICAR DATOS DE UNA OBRA SOCIAL*/
function editarObraSocial(idObraSocialAEditar){
    obraSocialSeleccionada= listaObraSociales.find((p) => p.id === idObraSocialAEditar);
    console.log(obraSocialSeleccionada);

    visualizarForm('Modificar información', vistaDelFormulario, formulario, mensajeError);
    nombreModificar.value = obraSocialSeleccionada.nombre;
    porcentajeModificar.value = obraSocialSeleccionada.porcentajeDescuento;
    descripcionModificar.value= obraSocialSeleccionada.descripcion;

};
if(document.getElementById('formulario')){

    document.getElementById('formulario').addEventListener('submit', evento =>{
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
        if(!/^(\d{1,3}(\.\d{1,2})?|0)?$/.test(porcentajeModificar.value)){
            warning+='*Porcentaje inválido<br>';
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
        
        obraSocialSeleccionada.nombre = nombreModificar.value;
        obraSocialSeleccionada.porcentajeDescuento = porcentajeModificar.value;
        obraSocialSeleccionada.descripcion = descripcionModificar.value;
        if(listaObraSociales.some((buscarOS)=> buscarOS.id === obraSocialSeleccionada.id)){
            guardarDatos("listaObraSociales", listaObraSociales);
        }else{
            listaObraSociales.push(obraSocialSeleccionada);
            guardarDatos("listaObraSociales", listaObraSociales);
        }

        console.clear();
        // console.log('Datos actualizados');

        //reseteamos el formulario y actualizamos la lista
        document.getElementById('formulario').reset();
        listarObraSocial();
        alert('✅ Datos actualizados correctamente');
        botonCerrar('vista-formulario');
        
    });
}



/*VISUALIZAR OBRA SOCIAL*/
//Definir variables
let obraSocialActual = null;
let vistaDeTarjetaProfesional = document.getElementById('card-vista');
const nombreVista= document.getElementById('vista-nombre');
const descripcionVista= document.getElementById('vista-descripcion');
const porcentajeVista= document.getElementById('vista-descuento');

function visualizarObraSocial(obrasocialAVisualizar){
    let obraSocialSeleccionada = listaObraSociales.find((p) => p.id === obrasocialAVisualizar);
    console.log(obraSocialSeleccionada);

    vistaDeTarjetaProfesional.classList.remove('d-none');
    if(obraSocialActual !== obraSocialSeleccionada.id){
        
        obraSocialActual = obraSocialSeleccionada.id;
        // console.log(obraSocialActual);

        nombreVista.innerHTML =obraSocialSeleccionada.nombre;
        descripcionVista.innerHTML = obraSocialSeleccionada.descripcion;
        porcentajeVista.innerHTML = obraSocialSeleccionada.porcentajeDescuento;
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

document.querySelectorAll('.botonCerrar').forEach(boton=>{
    boton.addEventListener('click', ()=>{
        const targetId = boton.dataset.target;
        botonCerrar(targetId);
    })
})

