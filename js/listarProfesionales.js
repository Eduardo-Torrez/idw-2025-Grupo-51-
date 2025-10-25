
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
    profesionalSeleccionado = lista.find((p) => p.id === idDelProfesionalAEliminar);
    // console.log(profesionalSeleccionado);

    if(confirm(`¿Esta seguro que quiere eliminar a ${profesionalSeleccionado.nombre} ${profesionalSeleccionado.apellido} de la lista de profesionales?`)){
        lista = lista.filter(profesional => profesional.id !== profesionalSeleccionado.id);

        localStorage.setItem("lista", JSON.stringify(lista));
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
const obraSocialModificar= document.getElementById('obrasocialModificar');
const fotografiaModificar= document.getElementById('fotografiaModificar');
const valorConsultaModificar= document.getElementById('valorConsultaModificar');
const mensajeError = document.getElementById('mensajeError');
const labelNombre = document.querySelector('label[for="nombre"]');
let profesionalSeleccionadoModificar = null;

function editarProfesional(idDelProfesionalAEditar){
    //buscar el profesional en la lista
    profesionalSeleccionadoModificar = lista.find((p) => p.id === idDelProfesionalAEditar);
    console.log(profesionalSeleccionadoModificar);

    document.getElementById('vista-formulario-modificar').classList.remove('d-none');
    console.log('esl formulaio se ve');

    //se traen los datos del medico
    matriculaModificar.value = profesionalSeleccionadoModificar.matricula;
    apellidoModificar.value = profesionalSeleccionadoModificar.apellido;
    nombreModificar.value = profesionalSeleccionadoModificar.nombre;
    especialidadModificar.value = profesionalSeleccionadoModificar.especialidad;
    descripcionModificar.value= profesionalSeleccionadoModificar.descripcion;
    obraSocialModificar.value = profesionalSeleccionadoModificar.obraSociales;
    valorConsultaModificar.value = profesionalSeleccionadoModificar.valorConsulta;


    //Base64
    fotografiaModificar.addEventListener('change', (e)=>{
        // const file = e.inputFile.files[0]
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onload = ()=>{
            profesionalSeleccionadoModificar.fotografia = reader.result;
            localStorage.setItem("lista", JSON.stringify(lista));
        };
        reader.readAsDataURL(file);
    })

};
if(document.getElementById('formulario-modificar')){

document.getElementById('formulario-modificar').style.backgroundColor = '#EFF5F8';
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
    if(!/^[a-zA-ZÀ-ÿ]{2,50}(?: [a-zA-Z]{2,50})*$/.test(especialidadModificar.value)){
        warning+= '*especialidad inválida<br>';
        console.log('Especialidad inválida');
        erroresEncontrados = true;
    }
    if(!/^[a-zA-ZÀ-ÿ ,]*$/.test(obraSocialModificar.value)){
        warning+= '*obra social inválida<br>';
        console.log('obra social inválido');
        erroresEncontrados = true;
    }
    if(!/^[\w.,%$ ]/.test(valorConsultaModificar.value)){
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
    profesionalSeleccionadoModificar.obraSociales = obraSocialModificar.value;
    profesionalSeleccionadoModificar.valorConsulta = valorConsultaModificar.value;

    localStorage.setItem("lista", JSON.stringify(lista));

    console.clear();
    // console.log('Datos actualizados');

    //reseteamos el formulario
    document.getElementById('formulario-modificar').reset();

    //actualizamos la lista
    listarProfesionales();
    alert('✅ Datos actualizados correctamente');
    botonCerrar(vistaDelFormulario);
    
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


/*división de responsabilidades: separamos las acciones en funciones*/
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