import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar, diasdelasemana, horarios, guardaroeditar} from "./utils.js";
let medicos = obtenerDatos("medicos");
let turnos = obtenerDatos("turnos");
console.log(turnos)
//Listar turnos
function listarTurnos(turnos){
    contadorDeTurnos();
    let tablaTurnos = document.getElementById('tablaTurnos');

    //Limpiar contenido previo de la tabla
    tablaTurnos.innerHTML = '';

    turnos.forEach((turno) => {
        //Para cada turno se creará una fila nueva
        let fila = document.createElement('tr');
        fila.style.textAlign = "center"; 

        //Para cada ila se creará su contenido
        let idfila = document.createElement('td');
        idfila.textContent = turno.id;

        let idMedico = document.createElement('td');
        const buscarMedico = medicos.find ((medico)=> medico.id === turno.idMedico);
        console.log(turno.idMedico);
        console.log( buscarMedico)
        idMedico.textContent = buscarMedico.nombre + ' ' + buscarMedico.apellido;

        let fechaYhora = document.createElement('td');
        fechaYhora.textContent = turno.fechaYhora.map(e => e.dia).join(', ');
        console.log(turno.fechaYhora.map(e => e.dia).join(', '));

        // let disponible = document.createElement('td');
        // disponible.textContent = turno.disponible;

        let botones = document.createElement('td');

        //crear los botones de borrar, editar y visualizar
        let div = document.createElement('div');
        div.classList.add("d-flex", "flex-column", "flex-lg-row","justify-content-center", "gap-2", "acciones");
        
        let botonEliminar = document.createElement('button');
        botonEliminar.classList.add("btn", "btn-outline");
        botonEliminar.innerHTML = '<i class="bi bi-trash"></i>';
        botonEliminar.addEventListener('click', function(){
            eliminarProfesional(turno.id);
        })

        let botonEditar = document.createElement('button');
        botonEditar.classList.add("btn", "btn-outline");
        botonEditar.innerHTML = ' <i class="bi bi-pencil-square"></i>';
        botonEditar.addEventListener('click', function(){
            editarProfesional(turno.id);

        })

        let botonVisualizar = document.createElement('button');
        botonVisualizar.classList.add("btn", "btn-outline");
        botonVisualizar.innerHTML = '<i class="bi bi-eye"></i>';
        botonVisualizar.addEventListener('click', function(){
            visualizarProfesional(turno.id);
        })


        div.appendChild(botonEliminar);
        div.appendChild(botonEditar);
        div.appendChild(botonVisualizar);
        fila.appendChild(idfila);
        fila.appendChild(idMedico);
        fila.appendChild(fechaYhora);
        // fila.appendChild(disponible);
        botones.appendChild(div);
        fila.appendChild(botones);
        tablaTurnos.appendChild(fila);
    });

}


//Definir variables
const seleccionarMedico = document.getElementById('seleccionarMedico');
const seleccionarDia = document.getElementById('seleccionarDia');
const seleccionarHoraInicio = document.getElementById('seleccionarHoraInicio');
const seleccionarHoraFin = document.getElementById('seleccionarHoraFin');
const mensajeError = document.getElementById('mensajeError');
let turnoSeleccionado = null;
let contadorId = 0;
let tituloFormulario = document.getElementById('titulo-formulario');
let vistaDelFormulario = document.getElementById('vista-formulario');
let formularioTurnoMedico =  document.getElementById('formularioTurnoMedico');
const crearTurno = document.getElementById('crearTurno');

//Crear turno médico
// function crearTurno(){
crearTurno.addEventListener('click', ()=>{
    //crear un objeto de medicos que aun no tienen turno
    let medicosSinTurnos = medicos.filter(m => !turnos.some((buscarTurno) => buscarTurno.idMedico === m.id));

    crearOpcionesMedicos(medicosSinTurnos);
    crearOpcionesDias();
    crearOpcionesHorario();

    tituloFormulario.innerHTML = `Crear nuevo turno médico`;
    vistaDelFormulario.classList.remove('d-none');
    formularioTurnoMedico.reset();
    mensajeError.innerHTML = "";

    // formulario();

});
// function formulario(){
    formularioTurnoMedico.addEventListener('submit', evento =>{
        evento.preventDefault();

        let warning = "";
        let erroresEncontrados = false;
        mensajeError.innerHTML = "";

        const idMedico = seleccionarMedico.value;
        const dia = diasdelasemana[seleccionarDia.value];
        const horaInicio =horarios[seleccionarHoraInicio.value];
        const horaFin = horarios[seleccionarHoraFin.value];
        
        if(!idMedico){
            warning+= '*Seleccione un(a) médico(a)<br>';
            console.log('médico seleccionado invalido');
            erroresEncontrados = true;
        }
        if(!dia){
            warning+= '*Día seleccionado invalido<br>';
            console.log('día seleccionado invalido');
            erroresEncontrados = true;
        }
        if(!horaInicio){
            warning+= '*Hora de inicio invalida<br>';
            console.log('hora de inicio invalida');
            erroresEncontrados = true;
        }
        if(!horaFin){
            warning+= '*Hora de finalización invalida<br>';
            console.log('hora de finalización invalida');
            erroresEncontrados = true;
        }
        if(erroresEncontrados){
            mensajeError.innerHTML=warning;
            return;
        }
        
        let id;
        const disponibilidad = {dia, horaInicio, horaFin};
        const fechaYhora = [disponibilidad];
        if(turnoSeleccionado){
            id = turnoSeleccionado.id;
        }
        else{
            id = contadorId++;
        }
        const turno = {id, idMedico, fechaYhora};
        let turnos = obtenerDatos("turnos")
        //Verificamos si el médico seleccioando ya tiene turnos asignados, si los tiene los sobre escribe, sino los crea
        guardaroeditar(turno, turnos);
        guardarDatos("turnos", turnos);
        
        console.clear();
        //reseteamos el formulario
        document.getElementById('formularioTurnoMedico').reset();
        //actualizamos la lista
        listarTurnos(turnos);
        alert('✅ Se creo turno correctamente');
        botonCerrar('vista-formulario');
    });
// }


function crearOpcionesMedicos(listaMedicos){
    let select = document.getElementById('seleccionarMedico');
    select.innerHTML = '';
    let opcionInicial = document.createElement('option');
    opcionInicial.value='';
    opcionInicial.innerHTML = "Elegir un médico";
    opcionInicial.selected = true;
    select.appendChild(opcionInicial);

    listaMedicos.forEach((medico) =>{
        let opcion = document.createElement('option');
        opcion.value = medico.id;
        opcion.innerHTML = `${medico.nombre} ${medico.apellido}`;
        select.appendChild(opcion);
    })
}
function crearOpcionesDias(){
    let select = document.getElementById('seleccionarDia');
    select.innerHTML = '';

    let opcionInicial = document.createElement('option');
    opcionInicial.value='';
    opcionInicial.innerHTML = "Elegir un dia";
    opcionInicial.selected = true;
    select.appendChild(opcionInicial);

    let valor = 0;
    diasdelasemana.forEach((dia) =>{
        let opcion = document.createElement('option');
        opcion.value = valor++;
        opcion.innerHTML = dia;

        if(opcion.value>0 && opcion.value<6){
            select.appendChild(opcion);
        }
    })
    
}
function crearOpcionesHorarioInicio(){
    let select = document.getElementById('seleccionarHoraInicio');
    select.innerHTML = '';

    let opcionInicial = document.createElement('option');
    opcionInicial.value='';
    opcionInicial.innerHTML = "00:00";
    opcionInicial.selected = true;
    select.appendChild(opcionInicial);

    let valor = 0;
    horarios.forEach((hora) =>{
        let opcion = document.createElement('option');
        opcion.value = valor++;
        opcion.innerHTML = hora;

        if(opcion.value<9){
            select.appendChild(opcion);
        }
    }) 
}

function crearOpcionesHorario(){
    let selectHoraInicio = document.getElementById('seleccionarHoraInicio');
    selectHoraInicio.innerHTML = '';

    let selectHoraFin = document.getElementById('seleccionarHoraFin');
    selectHoraFin.innerHTML = '';

    let horaInicio = horarios.slice(0,-1).map(hora =>`<option value="${horarios.indexOf(hora)}">${hora}</option>`).join('');
    let horaFin =horarios.slice(1).map(hora =>`<option value="${horarios.indexOf(hora)}">${hora}</option>`).join('');

    selectHoraInicio.innerHTML = `<option value="" selected>00:00</option>`+horaInicio;
    selectHoraFin.innerHTML = `<option value="" selected>00:00</option>`+horaFin;
}

function contadorDeTurnos(){
    let total = document.getElementById('totalTurnos');
    if (turnos.length === 1){
        total.innerHTML = 'Total ' + turnos.length + '  turno';
    } else{
        total.innerHTML = 'Total ' + turnos.length + ' turnos' ;
    }
}

document.querySelectorAll('.botonCerrar').forEach(boton=>{
    boton.addEventListener('click', ()=>{
        const targetId = boton.dataset.target;
        botonCerrar(targetId);
    })
});

listarTurnos(turnos);
contadorDeTurnos();
crearOpcionesMedicos(medicos);
