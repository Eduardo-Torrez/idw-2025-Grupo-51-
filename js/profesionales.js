import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar } from "./utils.js";
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
        if(buscarEspecialidad=== undefined){
            medico.especialidad = [];
            especialidad.textContent= "Sin especialidad";
        }else{
            especialidad.textContent= buscarEspecialidad.nombre;
        }

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

    if(confirm(`¿Esta seguro que quiere eliminar a ${profesionalSeleccionado.nombre} ${profesionalSeleccionado.apellido} de la lista de profesionales?`)){
        medicos = medicos.filter(profesional => profesional.id !== profesionalSeleccionado.id);

        guardarDatos("medicos", medicos);
        listarProfesionales();
        location.reload();

    }
};


/*MODIFICAR DATOS DE UN PROFESIONAL*/
//Definir variables globales
const matriculaModificar= document.getElementById('matriculaModificar');
const apellidoModificar= document.getElementById('apellidoModificar');
const nombreModificar= document.getElementById('nombreModificar');
const especialidadModificar= document.getElementById('especialidadModificar');
const descripcionModificar= document.getElementById('descripcionModificar');
const fotografiaModificar= document.getElementById('fotografiaModificar');
const valorConsultaModificar= document.getElementById('valorConsultaModificar');
const mensajeError = document.getElementById('mensajeError');
let vistaDelFormulario = document.getElementById('vista-formulario-modificar');
let profesionalSeleccionadoModificar = null;

function editarProfesional(idDelProfesionalAEditar){
    //buscar el profesional en la lista
    profesionalSeleccionadoModificar = medicos.find((p) => p.id === idDelProfesionalAEditar);
    console.log(profesionalSeleccionadoModificar);

    vistaDelFormulario.classList.remove('d-none');

    //se traen los datos del medico
    matriculaModificar.value = profesionalSeleccionadoModificar.matricula;
    apellidoModificar.value = profesionalSeleccionadoModificar.apellido;
    nombreModificar.value = profesionalSeleccionadoModificar.nombre;
    especialidadModificar.value = profesionalSeleccionadoModificar.especialidad;
    descripcionModificar.value= profesionalSeleccionadoModificar.descripcion;
    valorConsultaModificar.value = profesionalSeleccionadoModificar.valorConsulta;

    
    //crear las opciones de especialidades y obras sociales y seleccionar las que coincidan con el profesional
    crearOpcionesEspecialidad(profesionalSeleccionadoModificar);
    crearOpcionesObraSocial(profesionalSeleccionadoModificar);

    //Base64
    fotografiaModificar.addEventListener('change', (e)=>{
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = ()=>{
            profesionalSeleccionadoModificar.fotografia = reader.result;
            guardarDatos("medicos", medicos);
        };
        reader.readAsDataURL(file);
    })

};
if(document.getElementById('formulario-modificar')){
    document.getElementById('formulario-modificar').addEventListener('submit', evento =>{
        evento.preventDefault();

        const obraSocialModificar = Array.from(document.querySelectorAll('input:checked'));

        //si hay cambios se verifican si son correctos
        let warning = "";
        let erroresEncontrados = false;
        mensajeError.innerHTML = "";

        if(!/^[a-zA-ZÀ-ÿ]{2,50}(?: [a-zA-Z]{2,50})*$/.test(nombreModificar.value)){
            warning+='*Nombre inválido<br>';
            console.log('nombre error');
            erroresEncontrados = true;
        }
        if(!/^[a-zA-ZÀ-ÿ]{2,50}(?: [a-zA-Z]{2,50})*$/.test(apellidoModificar.value)){
            warning+= '*apellido inválido<br>';
            console.log('Apellido inválido');
            erroresEncontrados = true;
        }
        if(!/^[0-9]{5,10}$/.test(matriculaModificar.value)){
            warning+= '*matrícula inválida<br>';
            console.log('Matricula inválida');
            erroresEncontrados = true;
        }
        if(!/^(\d)$/.test(especialidadModificar.value)){
            warning+= '*especialidad inválida<br>';
            console.log('Especialidad inválida');
            erroresEncontrados = true;
        }
        if(0=== obraSocialModificar.length){
            warning+= '*obra social inválida<br>';
            console.log('obra social inválido');
            erroresEncontrados = true;
        }
        if(!/^(\d+([.,]\d+)?|[.,]\d+)$/.test(valorConsultaModificar.value)){
            warning+= '*valor consulta inválido<br>';
            console.log('valor de consulta inválido');
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
        

        profesionalSeleccionadoModificar.matricula = matriculaModificar.value;
        profesionalSeleccionadoModificar.apellido = apellidoModificar.value;
        profesionalSeleccionadoModificar.nombre = nombreModificar.value;
        profesionalSeleccionadoModificar.especialidad = especialidadModificar.value;
        profesionalSeleccionadoModificar.descripcion = descripcionModificar.value;
        profesionalSeleccionadoModificar.obraSociales = obraSocialModificar.map(i=>listaObraSociales.find((obso)=> obso.id === i.value));
        profesionalSeleccionadoModificar.valorConsulta = valorConsultaModificar.value;

        guardarDatos("medicos", medicos);

        console.clear();
        // console.log('Datos actualizados');

        //reseteamos el formulario
        document.getElementById('formulario-modificar').reset();

        //actualizamos la lista
        listarProfesionales();
        alert('✅ Datos actualizados correctamente');
        botonCerrar('vista-formulario-modificar');
        
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
    let select = document.getElementById('especialidadModificar');
    select.innerHTML ='';

    especialidades.forEach((item)=>{
        let opcion = document.createElement('option');
        opcion.value = item.id;
        opcion.innerHTML= item.nombre;

        if(item.id === profesional.especialidad){
            opcion.selected = true;
        }
        select.appendChild(opcion);
    })

    if(profesional.especialidad.length === 0){
        let opcion = document.createElement('option');
        opcion.value = "";
        opcion.selected = true;
        
        select.appendChild(opcion);
    }
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

        for(let itemObraSocial = 0; profesional.obraSociales[itemObraSocial]; ++itemObraSocial){
            if(profesional.obraSociales[itemObraSocial].id===item.id){

                input.checked = true;
                casilla.appendChild(input);
                casilla.appendChild(label);
                contenedor.appendChild(casilla);
            }
        }
        casilla.appendChild(input);
        casilla.appendChild(label);
        contenedor.appendChild(casilla);
    })
};


document.querySelectorAll('.botonCerrar').forEach(boton=>{
    boton.addEventListener('click', ()=>{
        const targetId = boton.dataset.target;
        botonCerrar(targetId);
        
    })
});



const btnAgregar = document.getElementById('btnAgregar');
const vistaFormularioAgregar = document.getElementById('vista-formulario-agregar');
const formularioAgregar = document.getElementById('formulario-agregar');


btnAgregar.addEventListener('click', () => {
    
    formularioAgregar.reset();
    
    
    vistaFormularioAgregar.classList.remove('d-none');
    
    
    crearOpcionesEspecialidadAgregar();
    crearOpcionesObraSocialAgregar();
});


formularioAgregar.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const nombre = document.getElementById('nombreAgregar').value;
    const apellido = document.getElementById('apellidoAgregar').value;
    const matricula = document.getElementById('matriculaAgregar').value;
    const especialidad = document.getElementById('especialidadAgregar').value;
    const valorConsulta = document.getElementById('valorConsultaAgregar').value;
    const descripcion = document.getElementById('descripcionAgregar').value;
    const fotografiaInput = document.getElementById('fotografiaAgregar');
    
    
    const obraSocialesChecks = document.querySelectorAll('#contenedorObrasocialesAgregar input:checked');
    const obrasSocialesSeleccionadas = Array.from(obraSocialesChecks).map(check => {
        
        return listaObraSociales.find(os => os.id === check.value);
    });

  
    
    const file = fotografiaInput.files[0];

    const procesarFormulario = (fotografiaBase64 = "") => { 
        
        const nuevoMedico = {
            id: Date.now().toString(), 
            nombre: nombre,
            apellido: apellido,
            matricula: matricula,
            especialidad: especialidad, 
            valorConsulta: valorConsulta,
            descripcion: descripcion,
            fotografia: fotografiaBase64, 
            obraSociales: obrasSocialesSeleccionadas 
        };

        
        medicos.push(nuevoMedico);
        guardarDatos("medicos", medicos);
        
        listarProfesionales(); 
        
        alert('✅ ¡Profesional agregado correctamente!');
        formularioAgregar.reset();
        vistaFormularioAgregar.classList.add('d-none'); 
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            procesarFormulario(reader.result); 
        };
        reader.readAsDataURL(file);
    } else {
        
        procesarFormulario(); 
    }
});




function crearOpcionesEspecialidadAgregar() {
    let select = document.getElementById('especialidadAgregar'); // ID del nuevo select
    select.innerHTML = '<option selected disabled value="">Seleccionar especialidad...</option>';

    especialidades.forEach((item) => {
        let opcion = document.createElement('option');
        opcion.value = item.id;
        opcion.innerHTML = item.nombre;
        select.appendChild(opcion);
    });
}

function crearOpcionesObraSocialAgregar() {
    
    let contenedor = document.getElementById('contenedorObrasocialesAgregar'); 
    contenedor.innerHTML = '';

    listaObraSociales.forEach((item) => {
        let casilla = document.createElement('div');
        casilla.classList.add("form-check", "col-6");

        let input = document.createElement('input');
        input.type = "checkbox";
        input.classList.add("form-check-label", "me-2");
        input.style.width = "auto";

        let label = document.createElement('label');
        label.classList.add('form-label');

        input.id = `agregar-${item.id}`; 
        input.value = item.id;
        label.setAttribute('for', `agregar-${item.id}`); 
        label.innerHTML = item.nombre;

        casilla.appendChild(input);
        casilla.appendChild(label);
        contenedor.appendChild(casilla);
    });
}