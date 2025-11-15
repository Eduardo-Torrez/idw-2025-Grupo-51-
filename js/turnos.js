import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar, visualizarForm, diasdelasemana, horariosMatutino, horarioVerpertino} from "./utils.js";
let medicos = obtenerDatos("medicos");
let turnos = obtenerDatos("turnos");
let especialidades = obtenerDatos("especialidades");

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
        const buscarMedico = medicos.find((medico)=> medico.id === turno.id_medico);
        idMedico.textContent = buscarMedico.nombre + ' ' + buscarMedico.apellido;

        let fechaYhora = document.createElement('td');
        const mostrarSoloDias = turno.fechayhora.map((m)=> `${diasdelasemana[m.dia]} ${m.hora_inicio} a ${m.hora_fin}`).join('\n');
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
            visualizarTurno(turno.id);
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
let turnoSeleccionado = null;
const seleccionarMedico = document.getElementById('seleccionarMedico');
let seleccionarHoraInicioManana = document.getElementById('seleccionarHoraInicioManana');
let seleccionarHoraFinManana = document.getElementById('seleccionarHoraFinManana');
let seleccionarHoraInicioTarde = document.getElementById('seleccionarHoraInicioTarde');
let seleccionarHoraFinTarde = document.getElementById('seleccionarHoraFinTarde');
const mensajeError = document.getElementById('mensajeError');
let vistaDelFormulario = document.getElementById('vista-formulario');
let formularioTurnoMedico =  document.getElementById('formularioTurnoMedico');
const crearTurno = document.getElementById('crearTurno');
let fechayhora = [];
let tituloFormulario = document.getElementById('tituloFormulario');
let contadorID = 0;

//Crear turno médico
crearTurno.addEventListener('click', ()=>{
    let medicosSinTurnos = medicos.filter(m => !turnos.some((buscarTurno) => buscarTurno.id_medico === m.id));
    crearOpcionesMedicos(medicosSinTurnos);
    let nuevoTurno = {
        'id': generarId(),
        'id_medico': seleccionarMedico.value,
        'fechayhora': []
    };

    turnoSeleccionado = nuevoTurno;
    visualizarForm('Crear nuevo turno médico',vistaDelFormulario, formularioTurnoMedico, mensajeError);
});

function editarTurno(turnoAEditar){
    //buscar turno
    turnoSeleccionado = turnos.find((t)=> t.id === turnoAEditar);
    const buscarMedico = medicos.find((medico)=> medico.id === turnoSeleccionado.id_medico);
    // console.log(turnoSeleccionado);

    visualizarForm(`Modificar turnos médicos de ${buscarMedico.nombre} ${buscarMedico.apellido}`,vistaDelFormulario, formularioTurnoMedico, mensajeError);

    seleccionarMedico.value = turnoSeleccionado.id_medico;
    document.getElementById('select-medico').classList.add('d-none');
    mostrarDiasyHorario(turnoSeleccionado);
}

formularioTurnoMedico.addEventListener('submit', evento =>{
    evento.preventDefault();

    let warning = "";
    let erroresEncontrados = false;
    mensajeError.innerHTML = "";

    if(!seleccionarMedico.value){
        warning+= '*Seleccione un(a) médico(a)<br>';
        erroresEncontrados = true;
    }
    if(seleccionarDias('diasManana') === false && seleccionarDias('diasTarde') ===false){
        warning+= '*Selecciona al menos un día de la semana<br>';
        erroresEncontrados = true;
    }
    if(seleccionarDias('diasManana')){
        if(!seleccionarHoraInicioManana.value){
            warning+= '*Hora inválida<br>';
            erroresEncontrados = true;
        }
        if(!seleccionarHoraFinManana.value){
            warning+= '*Hora inválida<br>';
            erroresEncontrados = true;
        }
    }
    if(seleccionarDias('diasTarde')){
        if(!seleccionarHoraInicioTarde.value){
            warning+= '*Hora inválida<br>';
            erroresEncontrados = true;
        }
        if(!seleccionarHoraFinTarde.value){
            warning+= '*Hora inválida<br>';
            erroresEncontrados = true;
        }
    }
    if(erroresEncontrados){
        mensajeError.innerHTML=warning;
        return;
    }


    let disponibilidad = {};
    turnoSeleccionado.id_medico = seleccionarMedico.value;
    if(seleccionarDias('diasManana')){
        const seleccionarDiasManana = Array.from(document.querySelectorAll('#diasManana input:checked'));

        disponibilidad = seleccionarDiasManana.map(dia =>({'dia':dia.value, 'hora_inicio':seleccionarHoraInicioManana.value, 'hora_fin':seleccionarHoraFinManana.value, 'franja': 'manana'}));
        turnoSeleccionado.fechayhora.push(...disponibilidad);
    }
    if(seleccionarDias('diasTarde')){
        const seleccionarDiasTarde = Array.from(document.querySelectorAll('#diasTarde input:checked'));
        
        disponibilidad = seleccionarDiasTarde.map(dia =>({'dia':dia.value, 'hora_inicio':seleccionarHoraInicioTarde.value, 'hora_fin':seleccionarHoraFinTarde.value, 'franja': 'tarde'}));
        turnoSeleccionado.fechayhora.push(...disponibilidad);
    }

    console.log(turnoSeleccionado);
    if(turnos.some(buscarTurno =>buscarTurno.id_medico === turnoSeleccionado.id_medico)){
        guardarDatos('turnos', turnos);
    }else{
        turnos.push(turnoSeleccionado);
        guardarDatos('turnos', turnos);
    }
    
    console.clear();
    //reseteamos el formulario
    document.getElementById('formularioTurnoMedico').reset();
    listarTurnos(turnos);
    alert('✅ Se creo turno correctamente');
    botonCerrar('vista-formulario');
});

/*Visualizar Turno*/
//Definir variables
let turnoActual = null;
let vistaDeTarjetaProfesional = document.getElementById('card-vista');
const vistaMedico = document.getElementById('vista-medico');
const vistaEspecialidad = document.getElementById('vista-especialidad');
const vistaFechaYHora = document.getElementById('vista-fechayhora');

function visualizarTurno(idTurnoAVisualizar){
    let turnoSeleccionado = turnos.find((t)=> t.id === idTurnoAVisualizar);
    // console.log(turnoSeleccionado);

    vistaDeTarjetaProfesional.classList.remove('d-none');
    if(turnoActual !== turnoSeleccionado.id){
        turnoActual = turnoSeleccionado.id

        let buscarMedico = medicos.find((medico)=> medico.id === turnoSeleccionado.id_medico);
        let buscarEspecialidad = especialidades.find((esp)=> esp.id === buscarMedico.especialidad);
        vistaMedico.innerHTML = `Dr(a). ${buscarMedico.nombre} ${buscarMedico.apellido}`;
        vistaEspecialidad.innerHTML = buscarEspecialidad.nombre;
        vistaFechaYHora.innerHTML = turnoSeleccionado.fechayhora.map((fyh)=> `${diasdelasemana[fyh.dia]} ${fyh.hora_inicio} hs a ${fyh.hora_fin} hs`).join('<br>');
    }
}

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
function seleccionarDias(idContenedor){
    const contenedor = document.getElementById(idContenedor);
    return contenedor.querySelector("input[type='checkbox']:checked") !== null;
}

function mostrarDiasyHorario(turnoElegido){
    // console.log(turnoElegido.fechayhora)
    turnoElegido.fechayhora.map(diahora =>{
        // console.log(diahora)
        if(diahora.franja === 'manana'){
            // console.log(diahora.dia)
            Array.from(document.querySelectorAll('#diasManana input[type="checkbox"]')).forEach(d =>{ 
                if(d.value === diahora.dia){d.checked = true}
            });

            seleccionarHoraInicioManana.value = diahora.hora_inicio;
            seleccionarHoraFinManana.value = diahora.hora_fin;
        }else{
            Array.from(document.querySelectorAll('#diasTarde input[type="checkbox"]')).forEach(d =>{ 
                // console.log(diahora.dia)
                if(d.value === diahora.dia){d.checked = true}
            });

            seleccionarHoraInicioTarde.value = diahora.hora_inicio;
            seleccionarHoraFinTarde.value = diahora.hora_fin;
        }
    })
}

function generarId(){
    if(turnos.length ===0){
        return contadorID++;
    }else{
      contadorID = parseInt(turnos[turnos.length-1].id) + 1;
      return contadorID;
    }
    
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


