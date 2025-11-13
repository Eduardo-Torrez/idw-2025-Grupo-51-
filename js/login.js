const formLogin =document.getElementById('formLogin');
const usuario =document.getElementById('usuario');
const clave =document.getElementById('clave');
const mensaje=document.getElementById('mensaje');

function mostrarMensaje(texto,tipo="danger"){
    mensaje.innerHTML=`
        <div class="col-md-3 col-lg-4">
            <div class="alert alert-${(tipo)}">${texto}</div>
        </div>`;
}

formLogin.addEventListener('submit',function(event){
    event.preventDefault();

    let usuarioInput = usuario.value.trim(); 
    let claveInput=clave.value.trim();

    const isUsuario=usuarios.find(
        u=>u.usuario === usuarioInput && u.clave === claveInput
    );
    /*session storage */
    if (isUsuario){
        sessionStorage.setItem("usuarioLogueado",usuarioInput);
        mostrarMensaje(`bienvenido Usuario ${usuarioInput}`,"success");
    /*redireciono a la pagina de alta medico linck de si me logeo entro a la pagina de alta medico */
        window.location.href="admin.html";
    }else{
        mostrarMensaje('Error en credenciales',"danger");
    }
    
})
