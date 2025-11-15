import { obtenerDatos } from "./localstorage.js";
let medicos = obtenerDatos("medicos");
let especialidades =obtenerDatos("especialidades");

function mostrarlista(){
    let listaMedicosContainer = document.getElementById("listaMedicosCcontainer");
    listaMedicosContainer.innerHTML='';
    medicos.forEach((medico)=>{
        console.log(medico)
        let cardHTML = document.createElement('div');
        cardHTML.innerHTML= `
            <div class="col d-flex">
                <div class="card shadow-sm h-100 w-100">
                    <img src="${medico.fotografia}" class="card-img-top" alt="Foto de medico" style="height: 250px; object-fit: cover; object-position: top;">
                    <div class="card-body text-start">
                        <h5 class="card-title">${medico.nombre} ${medico.apellido}</h5>
                        <p class="card-text"><strong>Especialidad:</strong> ${especialidades.find(especialidad=>especialidad.id===medico.especialidad).nombre}</p>
                    </div>
                </div>
            </div>
        `;
        listaMedicosContainer.appendChild(cardHTML);
    })
}
mostrarlista();