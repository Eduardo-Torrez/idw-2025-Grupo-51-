const formAltaMedico = document.getElementById('altaMedicoForm');
const inputNombre = document.getElementById('nombre');
const inputEspecialidad= document.getElementById('especialidad');
const inputObraS=document.getElementById('obrasocial');



function altaMedicos(event){
    event.preventDefault(); /* realiza que no se recarge la pagina*/
    let nombre = inputNombre.value.trim();
    let especialidad = inputEspecialidad.value.trim();
    let obrasocial = inputObraS.value.trim();

    if (!nombre || !especialidad || !obrasocial){
        alert('Porfavor complete los campos requeridos');
        return;
    }
    alert(
        `Medico registrado:\n\n `+
        `Nombre: ${nombre}\n` +
        `Especialidad: ${especialidad}\n` +
        `ObraSocial: ${obrasocial}\n`);
    formAltaMedico.reset();
}
formAltaMedico.addEventListener('submit', altaMedicos)


