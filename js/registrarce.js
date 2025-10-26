const formRegistro = document.getElementById('formRegistro');
const inputApellido=document.getElementById('apellido')
const inputNombre = document.getElementById('nombre');
const inputCorreo=document.getElementById('correo')
const inputTelefono= document.getElementById('telefono');
const inputContraseña=document.getElementById('contraseña');

function altaUsuario(event){
    event.preventDefault(); /* realiza que no se recarge la pagina*/
    let apellido = inputApellido.value.trim();
    let nombre = inputNombre.value.trim();
    let correo = inputCorreo.value.trim();
    let telefono = inputTelefono.value.trim();
    let contraseña=inputContraseña.value.trim();

    if (!apellido || !nombre || !correo || !obrasocial || !telefono || !contraseña ){
        alert('Porfavor complete los campos requeridos');
        return;
    }
    alert(
        `Usuario Registrado:\n\n `+
        `Apellido: ${apellido}\n` +
        `Nombre: ${nombre}\n` +
        `correo: ${correo}\n` +
        `telefono: ${telefono}\n`);
    formRegistro.reset();
}
formRegistro.addEventListener('submit', altaUsuario)


