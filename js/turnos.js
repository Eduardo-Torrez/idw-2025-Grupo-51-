import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar, diasdelasemana, horarios} from "./utils.js";
let medicos = obtenerDatos("medicos");
let turnos = obtenerDatos("turnos");

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
        const buscarMedico = medicos.find((medico)=> medico.id === turno.id_medico);
        idMedico.textContent = buscarMedico.nombre + ' ' + buscarMedico.apellido;

        let fechaYhora = document.createElement('td');
        const mostrarSoloDias = turno.fechayhora.map((m)=> `${m.dia} ${m.hora_inicio} a ${m.hora_fin}`).join('\n');
        fechaYhora.textContent = mostrarSoloDias;

        let botones = document.createElement('td');
        //crear los botones de borrar, editar y visualizar
        let div = document.createElement('div');
        div.classList.add("d-flex", "flex-column", "flex-lg-row","justify-content-center", "gap-2", "acciones");
        
        let botonEliminar = document.createElement('button');
        botonEliminar.classList.add("btn", "btn-outline");
        botonEliminar.innerHTML = '<i class="bi bi-trash"></i>';
        botonEliminar.addEventListener('click', function(){
            eliminarTurno(turno.id);
        })

        let botonEditar = document.createElement('button');
        botonEditar.classList.add("btn", "btn-outline");
        botonEditar.innerHTML = ' <i class="bi bi-pencil-square"></i>';
        botonEditar.addEventListener('click', function(){
            editarTurno(turno.id);
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
        botones.appendChild(div);
        fila.appendChild(botones);
        tablaTurnos.appendChild(fila);
    });
}


//Definir variables
const seleccionarMedico = document.getElementById('seleccionarMedico');
const seleccionarDia = document.getElementById('seleccionarDia');
const seleccionarHoraInicioManana = document.getElementById('seleccionarHoraInicioManana');
const seleccionarHoraFinManana = document.getElementById('seleccionarHoraFinManana');
const seleccionarHoraInicioTarde = document.getElementById('seleccionarHoraInicioTarde');
const seleccionarHoraFinTarde = document.getElementById('seleccionarHoraFinTarde');
const mensajeError = document.getElementById('mensajeError');
let turnoSeleccionadoModificar = null;
let tituloFormulario = document.getElementById('titulo-formulario');
let vistaDelFormulario = document.getElementById('vista-formulario');
let formularioTurnoMedico =  document.getElementById('formularioTurnoMedico');
const crearTurno = document.getElementById('crearTurno');

//Crear turno médico
crearTurno.addEventListener('click', ()=>{
    //crear un objeto de medicos que aun no tienen turno
    let medicosSinTurnos = medicos.filter(m => !turnos.some((buscarTurno) => buscarTurno.id_medico === m.id));

    crearOpcionesMedicos(medicosSinTurnos);
    crearOpcionesDias();
    crearOpcionesHorario();

    document.getElementById('nuevoTurno').classList.add('d-none');
    tituloFormulario.innerHTML = `Crear nuevo turno médico`;
    vistaDelFormulario.classList.remove('d-none');
    formularioTurnoMedico.reset();
    mensajeError.innerHTML = "";
});

function editarTurno(turnoAEditar){
    //buscar turno
    turnoSeleccionadoModificar = turnos.find((t)=> t.id === turnoAEditar);
    const buscarMedico = medicos.find((medico)=> medico.id === turnoSeleccionadoModificar.id_medico);
    // console.log(turnoSeleccionadoModificar);

    tituloFormulario.innerHTML = `Modificar turnos  médicos del Dr. ${buscarMedico.nombre} ${buscarMedico.apellido}`;
    vistaDelFormulario.classList.remove('d-none');
    formularioTurnoMedico.reset();
    mensajeError.innerHTML = "";

    seleccionarMedico.value = turnoSeleccionadoModificar.id_medico;
    document.getElementById('select-medico').classList.add('d-none');

    turnoSeleccionadoModificar.fechayhora.map(fecha =>{
        crearOpcionesDias();
        crearOpcionesHorario();
        console.log(diasdelasemana.findIndex(d =>d ===fecha.dia));
        seleccionarDia.value = diasdelasemana.findIndex(d =>d ===fecha.dia);
        seleccionarHoraInicio.value = horarios.findIndex(horai =>horai ===fecha.hora_inicio);
        seleccionarHoraFin.value = horarios.findIndex(horaf =>horaf ===fecha.hora_fin);
        
    })
}

formularioTurnoMedico.addEventListener('submit', evento =>{
    evento.preventDefault();

    let horarioManana = validarHora(seleccionarHoraInicioManana.value, seleccionarHoraFinManana.value);
    let horarioTarde = validarHora(seleccionarHoraInicioTarde.value, seleccionarHoraFinTarde.value);

    let warning = "";
    let erroresEncontrados = false;
    mensajeError.innerHTML = "";

    if(!seleccionarMedico.value){
        warning+= '*Seleccione un(a) médico(a)<br>';
        console.log('médico seleccionado invalido');
        erroresEncontrados = true;
    }
    if(!seleccionarDia.value){
        warning+= '*Día seleccionado invalido<br>';
        console.log('día seleccionado invalido');
        erroresEncontrados = true;
    }
    if(horarioManana === false && horarioTarde === false){
        warning+= '*Hora invalida<br>';
        console.log('hora invalida');
        erroresEncontrados = true;
    }
    if(erroresEncontrados){
        mensajeError.innerHTML=warning;
        return;
    }

    let horaInicio =horarios;
    let horaFin = horarios;
    if(horarioManana){
        horaInicio =horarios[seleccionarHoraInicioManana.value];
        horaFin = horarios[seleccionarHoraFinManana.value];
    } else{
        horaInicio =horarios[seleccionarHoraInicioTarde.value];
        horaFin = horarios[seleccionarHoraFinTarde.value];
    }  
    let id_medico = seleccionarMedico.value;
    let dia = diasdelasemana[seleccionarDia.value];
    let disponibilidad = {'dia':dia, 'hora_inicio':horaInicio, 'hora_fin':horaFin};
    // console.log(disponibilidad);

    if(turnoSeleccionadoModificar){
        let existeHorario = turnoSeleccionadoModificar.fechayhora.map(fyh => fyh.dia === dia);
        if(existeHorario){    
            turnoSeleccionadoModificar.fechayhora = disponibilidad;
            guardarDatos("turnos", turnos);
        }
        else{
            turnoSeleccionadoModificar.fechayhora.push(disponibilidad);
            guardarDatos("turnos", turnos);
        }
    }else{
        const id = turnos.length+1;
        const fechayhora = [disponibilidad];
        const turno = {id, id_medico, fechayhora};
        turnos.push(turno);
        guardarDatos("turnos", turnos);
    }
    
    console.clear();
    //reseteamos el formulario
    document.getElementById('formularioTurnoMedico').reset();
    //actualizamos la lista
    listarTurnos(turnos);
    alert('✅ Se creo turno correctamente');
    botonCerrar('vista-formulario');
});

/*ELIMINAR DATOS DE UN TURNO*/
function eliminarTurno(turnoAEliminar){
    let turnoSeleccionado = turnos.find((t) => t.id === turnoAEliminar);
    const buscarMedico = medicos.find((medico)=> medico.id === turnoSeleccionado.id_medico);

    if(confirm(`❌ ¿Esta seguro que quiere eliminar los turnos médicos pertenecientes al Dr. ${buscarMedico.nombre} ${buscarMedico.apellido}?`)){
        turnos = turnos.filter(turno => turno.id !== turnoSeleccionado.id);

        guardarDatos("turnos", turnos);
        listarTurnos(turnos);
        location.reload();

    }
};

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
function crearOpcionesHorario(){
    let selectHoraInicioM = document.getElementById('seleccionarHoraInicioManana');
    selectHoraInicioM.innerHTML = '';
    let selectHoraFinM = document.getElementById('seleccionarHoraFinManana');
    selectHoraFinM.innerHTML = '';

    let selectHoraInicioT = document.getElementById('seleccionarHoraInicioTarde');
    selectHoraInicioT.innerHTML = '';
    let selectHoraFinT = document.getElementById('seleccionarHoraFinTarde');
    selectHoraFinT.innerHTML = '';

    let horaInicio = horarios.slice(0,-1).map(hora =>`<option value="${horarios.indexOf(hora)}">${hora}</option>`).join('');
    let horaFin =horarios.slice(1).map(hora =>`<option value="${horarios.indexOf(hora)}">${hora}</option>`).join('');

    selectHoraInicioM.innerHTML = `<option value="" selected>00:00</option>`+horaInicio;
    selectHoraFinM.innerHTML = `<option value="" selected>00:00</option>`+horaFin;

     selectHoraInicioT.innerHTML = `<option value="" selected>00:00</option>`+horaInicio;
    selectHoraFinT.innerHTML = `<option value="" selected>00:00</option>`+horaFin;
}

function validarHora(inicio, fin){
    if (!inicio && !fin) return false;
    if (!inicio || !fin) return false;
    return true;
};

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
