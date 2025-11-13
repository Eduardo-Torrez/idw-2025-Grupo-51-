import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar, visualizarForm } from "./utils.js";
let medicos = obtenerDatos("medicos");
let especialidades = obtenerDatos("especialidades");
let listaObraSociales = obtenerDatos("listaObraSociales");

//LISTAR PROFESIONALES
function listarProfesionales(){
    
    contadorDeProfesioanles();
    let tablaProfesionales = document.getElementById('tablaProfesionales');
        
    //Limpiar contenido previo de la tabla
    tablaProfesionales.innerHTML = '';

    medicos.forEach((medico) => {
        //Para cada médico se creará una nueva fila
        let fila = document.createElement('tr');
        fila.style.textAlign = "center"; 

        //para cada fila se creará su contenido
        let idfila = document.createElement('td');
        idfila.textContent = medico.id;

        let nombreyapellido = document.createElement('td');
        nombreyapellido.innerHTML = medico.nombre + ' ' + medico.apellido;

        let especialidad = document.createElement('td');
        const buscarEspecialidad = especialidades.find((esp)=> esp.id === medico.especialidad);
        especialidad.textContent= buscarEspecialidad.nombre;

        let matricula = document.createElement('td');
        matricula.textContent= medico.matricula;

        let valorConsulta = document.createElement('td');
        valorConsulta.textContent= medico.valorConsulta;

        let obrasSociales = document.createElement('td');
        medico.obraSociales = medico.obraSociales.filter(buscarObraSocial =>
            listaObraSociales.some((obrasocial)=> obrasocial.id === buscarObraSocial.id)
        )
        obrasSociales.textContent=mapearObraSocial(medico);


        let botones = document.createElement('td');

        //crear los botones de borrar, editar y visualizar
        let div = document.createElement('div');
        div.classList.add("d-flex", "flex-column", "flex-lg-row","justify-content-center", "gap-2", "acciones");
        
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
            editarProfesional(medico.id);

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


/*ELIMINAR DATOS DE UN PROFESIONAL*/
function eliminarProfesional(idDelProfesionalAEliminar){
    let profesionalSeleccionado = medicos.find((p) => p.id === idDelProfesionalAEliminar);
    // console.log(profesionalSeleccionado);

    if(confirm(`❌ ¿Esta seguro que quiere eliminar a ${profesionalSeleccionado.nombre} ${profesionalSeleccionado.apellido} de la lista de profesionales?`)){
        medicos = medicos.filter(profesional => profesional.id !== profesionalSeleccionado.id);

        guardarDatos("medicos", medicos);
        listarProfesionales();
        location.reload();

    }
};


/*MODIFICAR DATOS DE UN PROFESIONAL*/
//Definir variables
let matriculaModificar= document.getElementById('matricula');
let apellidoModificar= document.getElementById('apellido');
let nombreModificar= document.getElementById('nombre');
let especialidadModificar= document.getElementById('elegirEspecialidad');
let descripcionModificar= document.getElementById('descripcion');
let fotografiaModificar= document.getElementById('fotografia');
let valorConsultaModificar= document.getElementById('valorConsulta');
let mensajeError = document.getElementById('mensajeError');
let obrasocial=document.getElementById('contenedorObrasociales')
let vistaDelFormulario = document.getElementById('vista-formulario');
let agregarProfesional= document.getElementById('agregarProfesional');
let medicoSeleccionado = null;
let formulario=document.getElementById('formulario');
let tituloFormulario = document.getElementById('tituloFormulario');

function editarProfesional(idDelProfesionalAEditar){
    //buscar el profesional en la lista
    medicoSeleccionado = medicos.find((p) => p.id === idDelProfesionalAEditar);
    console.log(medicoSeleccionado);

    vistaDelFormulario.classList.remove('d-none');
    //crear las opciones de especialidades y obras sociales y seleccionar las que coincidan con el profesional
    crearOpcionesEspecialidad(medicoSeleccionado);
    crearOpcionesObraSocial(medicoSeleccionado);

    //se traen los datos del medico
    matriculaModificar.value = medicoSeleccionado.matricula;
    apellidoModificar.value = medicoSeleccionado.apellido;
    nombreModificar.value = medicoSeleccionado.nombre;
    especialidadModificar.value = medicoSeleccionado.especialidad;
    descripcionModificar.value= medicoSeleccionado.descripcion;
    valorConsultaModificar.value = medicoSeleccionado.valorConsulta;
    
    console.log(medicoSeleccionado.especialidad)
    console.log(especialidadModificar.value)
    console.log(especialidadModificar.value = medicoSeleccionado.especialidad)

    //Base64
    fotografiaModificar.addEventListener('change', (e)=>{
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = ()=>{
            medicoSeleccionado.fotografia = reader.result;
            guardarDatos("medicos", medicos);
        };
        reader.readAsDataURL(file);
    })

};
if(document.getElementById('formulario')){
    document.getElementById('formulario').addEventListener('submit', evento =>{
        evento.preventDefault();

        const obraSocialModificar = Array.from(document.querySelectorAll('input:checked'));

        //si hay cambios se verifican si son correctos
        let warning = "";
        let erroresEncontrados = false;
        mensajeError.innerHTML = "";

        if(!/^[a-zA-ZÀ-ÿ]{2,50}(?: [a-zA-Z]{2,50})*$/.test(nombreModificar.value)){
            warning+='*Nombre inválido<br>';
            erroresEncontrados = true;
        }
        if(!/^[a-zA-ZÀ-ÿ]{2,50}(?: [a-zA-Z]{2,50})*$/.test(apellidoModificar.value)){
            warning+= '*apellido inválido<br>';
            erroresEncontrados = true;
        }
        if(!/^[0-9]{5}$/.test(matriculaModificar.value)){
            warning+= '*matrícula inválida (deben ser 5 dígitos)<br>';
            erroresEncontrados = true;
        }
        if(!/^(\d)$/.test(especialidadModificar.value)){
            warning+= '*especialidad inválida<br>';
            erroresEncontrados = true;
        }
        // if(0=== obraSocialModificar.length){
        //     warning+= '*obra social inválida<br>';
        //     console.log('obra social inválido');
        //     erroresEncontrados = true;
        // }
        if(!/^(\d+([.,]\d+)?|[.,]\d+)$/.test(valorConsultaModificar.value)){
            warning+= '*valor consulta inválido<br>';
            erroresEncontrados = true;
        }
        if(!descripcionModificar.value){
            warning+= '*agregue una descripción';
            erroresEncontrados = true;
        }

        if(erroresEncontrados){
            mensajeError.innerHTML=warning;
            return;
        }
        
        medicoSeleccionado.nombre=nombreModificar.value;
        medicoSeleccionado.matricula = matriculaModificar.value;
        medicoSeleccionado.apellido = apellidoModificar.value;
        medicoSeleccionado.nombre = nombreModificar.value;
        medicoSeleccionado.especialidad = especialidades.find((esp)=> esp.id === especialidadModificar.value).id;
        medicoSeleccionado.descripcion = descripcionModificar.value;
        medicoSeleccionado.obraSociales = obraSocialModificar.map(i=>listaObraSociales.find((obso)=> obso.id === i.value));
        medicoSeleccionado.valorConsulta = valorConsultaModificar.value;

        if(medicos.some(buscarProfesional => buscarProfesional.id=== medicoSeleccionado.id)){
            guardarDatos('medicos',medicos);
        }else{
            medicos.push(medicoSeleccionado);
            guardarDatos('medicos',medicos);
        }
        console.clear();
        //reseteamos el formulario
        document.getElementById('formulario').reset();

        //actualizamos la lista
        listarProfesionales();
        alert('✅ Datos actualizados correctamente');
        botonCerrar('vista-formulario');
        
    });
}



/*VISUALIZAR DATOS DE UN PROFESIONAL*/
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
    let profesionalSeleccionado = medicos.find((p) => p.id === idDelProfesionalAVisualizar);
    // console.log(profesionalSeleccionado);

    vistaDeTarjetaProfesional.classList.remove('d-none');
    if(profesionalActual !== profesionalSeleccionado.id){
        
        profesionalActual = profesionalSeleccionado.id;
        // console.log(profesionalActual);

        matriculaVista.innerHTML = profesionalSeleccionado.matricula;
        nombreVista.innerHTML = profesionalSeleccionado.nombre + ' ' + profesionalSeleccionado.apellido;
        especialidadVista.innerHTML = especialidades.find((esp)=> esp.id === profesionalSeleccionado.especialidad).nombre;
        obrasSocialesVista.innerHTML = mapearObraSocial(profesionalSeleccionado);
        valorConsultavista.innerHTML = profesionalSeleccionado.valorConsulta;
        descripcionVista.innerHTML = profesionalSeleccionado.descripcion;
        fotografiaVista.src = profesionalSeleccionado.fotografia

    }

};


function contadorDeProfesioanles(){
    let total = document.getElementById('totalProfesionales');
    if (medicos.length == 1){
        total.innerHTML = 'Total ' + medicos.length + ' profesional';
    } else{
        total.innerHTML = 'Total ' + medicos.length + ' profesionales' ;
    }
}contadorDeProfesioanles();


function mapearObraSocial(profesional){
    const obrasocialformateada = profesional.obraSociales.map(objeto => 
        listaObraSociales.find((buscarObraSocial)=> buscarObraSocial.id === objeto.id).nombre
    )
    return obrasocialformateada.join(", ");
}

function crearOpcionesEspecialidad(profesional){
    let select = document.getElementById('elegirEspecialidad');
    select.innerHTML ='';

    especialidades.forEach((item)=>{
        let opcion = document.createElement('option');
        opcion.value = item.id;
        opcion.innerHTML= item.nombre;

        if(profesional.especialidad && item.id == profesional.especialidad){
            opcion.selected = true;
        }
        select.appendChild(opcion);
    })
}

function crearOpcionesObraSocial(profesional){
    let contenedor = document.getElementById('contenedorObrasociales');
    contenedor.innerHTML='';

    listaObraSociales.forEach((item)=>{
        let casilla = document.createElement('div');
        casilla.classList.add("form-check", "col-6");

        let input = document.createElement('input');
        input.type = "checkbox";
        input.classList.add("form-check-label", "me-2");
        input.style.width = "auto";

        let label = document.createElement('label');
        label.classList.add = 'form-label';

        input.id= item.nombre ;
        input.value= item.id ;
        label.for = item.nombre ;
        label.innerHTML= item.nombre;

        let obrasSociales = Array.isArray(profesional.obraSociales) ? profesional.obraSociales : [];
        for(let itemObraSocial = 0; itemObraSocial<obrasSociales.length; ++itemObraSocial){
        // for(let itemObraSocial = 0; profesional.obraSociales[itemObraSocial]; ++itemObraSocial){
            if(obrasSociales[itemObraSocial].id===item.id){

                input.checked = true;
                casilla.appendChild(input);
                casilla.appendChild(label);
                contenedor.appendChild(casilla);
            }
        }
        casilla.appendChild(input);
        casilla.appendChild(label);
        contenedor.appendChild(casilla);

        if(obrasSociales.length === 0){
            input.checked = false;
            casilla.appendChild(input);
            casilla.appendChild(label);
            contenedor.appendChild(casilla);
        }
    })
};


document.querySelectorAll('.botonCerrar').forEach(boton=>{
    boton.addEventListener('click', ()=>{
        const targetId = boton.dataset.target;
        botonCerrar(targetId);
        
    })
});


agregarProfesional.addEventListener('click', () => {
    let nuevoProfesional={};
    let id=Date.now().toString();
    nuevoProfesional={
        'id':id,
        'matricula':matriculaModificar.value,
        'nombre':nombreModificar.value,
        'apellido':apellidoModificar.value,
        'especialidad':especialidadModificar.value,
        'descripcion':descripcionModificar.value,
        'obraSociales':obrasocial.value,
        'fotografia':fotografiaModificar.value,
        'valorConsulta':valorConsultaModificar.value
    };
    crearOpcionesEspecialidad(nuevoProfesional);
    crearOpcionesObraSocial(nuevoProfesional);
    //Base64
    fotografiaModificar.addEventListener('change', (e)=>{
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = ()=>{
            nuevoProfesional.fotografia = reader.result;
            guardarDatos("medicos", medicos);
        };
        reader.readAsDataURL(file);
    })
    medicoSeleccionado=nuevoProfesional;
    visualizarForm('Agregar nuevo profesional', vistaDelFormulario, formulario, mensajeError)
});

