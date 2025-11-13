import { obtenerDatos } from "./localstorage.js";

const btn = document.getElementById('modoBtn');
btn.addEventListener('click', () => {
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('text-white');
    document.querySelectorAll('.card').forEach(card => {
        card.classList.toggle('bg-secondary');
        card.classList.toggle('text-white');
    });
    document.querySelectorAll('.logo').forEach(logo => {
        logo.classList.toggle('invertido');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    mostrarMedicosAleatorios(); 
    inicializarFiltros();
});


function mostrarMedicosAleatorios() {
    const medicos = obtenerDatos("medicos");
    if (!medicos || medicos.length === 0) return;

    const medicosAleatorios = medicos
        .map(m => ({ m, sort: Math.random() })) 
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.m);

    
    cargarMedicos(null, null, null, medicosAleatorios);
}


function inicializarFiltros() {
    const selectEspecialidad = document.getElementById('filtro-especialidad');
    const selectObra = document.getElementById('filtro-obra');
    const inputNombre = document.getElementById('filtro-nombre'); // <-- NUEVO
    const titulo = document.getElementById('titulo-especialidad');

    
    const especialidades = obtenerDatos("especialidades");
    if (especialidades && especialidades.length > 0) {
        selectEspecialidad.innerHTML = `
            <option value="">Filtrar por Especialidad</option>
            ${especialidades.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
        `;
    }

    
    const obrasSociales = obtenerDatos("listaObraSociales");
    if (obrasSociales && obrasSociales.length > 0) {
        selectObra.innerHTML = `
            <option value="">Filtrar por Obra Social</option>
            ${obrasSociales.map(o => `<option value="${o.id}">${o.nombre}</option>`).join('')}
        `;
    }

    
   

    selectEspecialidad.addEventListener('change', () => {
        const especialidades = obtenerDatos("especialidades");
        const seleccionado = selectEspecialidad.value;
        const espObj = especialidades.find(esp => esp.id === seleccionado);
        const nombreEspecialidad = espObj ? espObj.nombre : "Todos los profesionales";
        titulo.innerHTML = `Especialistas en <strong>${nombreEspecialidad}</strong>:`;

       
        cargarMedicos(seleccionado, selectObra.value, inputNombre.value);
    });

    
    selectObra.addEventListener('change', () => {
        cargarMedicos(selectEspecialidad.value, selectObra.value, inputNombre.value);
    });

    
    inputNombre.addEventListener('input', () => {
        
        cargarMedicos(selectEspecialidad.value, selectObra.value, inputNombre.value);
    });
}



function cargarMedicos(filtroEspecialidad = null, filtroObra = null, filtroNombre = null, medicosLista = null) {
    const medicos = medicosLista || obtenerDatos("medicos");
    const especialidades = obtenerDatos("especialidades");
    const container = document.getElementById('lista-medicos-container');
    if (!container) return;
    container.innerHTML = '';

    
    let medicosFiltrados = medicos;

    

    
    if (filtroEspecialidad) {
        medicosFiltrados = medicosFiltrados.filter(m => m.especialidad === filtroEspecialidad);
    }

    
    if (filtroObra) {
        medicosFiltrados = medicosFiltrados.filter(medico =>
            medico.obraSociales && medico.obraSociales.some(os => os.id === filtroObra)
        );
    }

    
    if (filtroNombre) {
       
        const terminoBusqueda = filtroNombre.trim().toLowerCase(); 
        
        medicosFiltrados = medicosFiltrados.filter(medico => {
            const nombreCompleto = `${medico.nombre} ${medico.apellido}`.toLowerCase();
            return nombreCompleto.includes(terminoBusqueda);
        });
    }


    if (medicosFiltrados.length === 0) {
        container.innerHTML = '<p class="text-center col-12">No hay médicos que cumplan con los filtros seleccionados.</p>';
        return;
    }

    
    medicosFiltrados.forEach(medico => {
        const especialidadObj = especialidades.find(esp => esp.id === medico.especialidad);
        const nombreEspecialidad = especialidadObj ? especialidadObj.nombre : "Sin especialidad";
        const nombreCompleto = `${medico.nombre} ${medico.apellido}`;
        const imagenSrc = medico.fotografia ? medico.fotografia : 'img/default-doctor.png';
        const linkReserva = `reservarTurno.html?id=${medico.id}`;
        const obrasSociales = obtenerDatos("listaObraSociales");
        let nombresObras = "No registra obras sociales";

        if (medico.obraSociales && medico.obraSociales.length > 0 && obrasSociales) {
            const obrasDelMedico = medico.obraSociales
                .map(os => {
                    const obra = obrasSociales.find(o => o.id === os.id);
                    return obra ? obra.nombre : null;
                })
                .filter(nombre => nombre !== null);

            if (obrasDelMedico.length > 0) {
                nombresObras = obrasDelMedico.join(", ");
            }
        }

        const cardHTML = `
            <div class="col d-flex">
                <div class="card shadow-sm h-100 w-100">
                    <img src="${imagenSrc}" class="card-img-top" alt="Foto de ${nombreCompleto}" style="height: 250px; object-fit: cover;">
                    <div class="card-body text-start">
                        <h5 class="card-title">${nombreCompleto}</h5>
                        <p class="card-text"><strong>Especialidad:</strong>${nombreEspecialidad}</p>
                        <p class="card-text"><strong>Obras sociales:</strong> ${nombresObras}</p>
                        <a href="${linkReserva}" class="btn btn-servicio">Reservar turno</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}