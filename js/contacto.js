import { guardarDatos, obtenerDatos } from "./localstorage.js"; 

document.addEventListener('DOMContentLoaded', () => {
    
    const formulario = document.querySelector('.formulario');

    formulario.addEventListener('submit', (e) => {
       
        e.preventDefault(); 

        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const mensaje = document.getElementById('mensaje').value;

       
        let consultas = obtenerDatos("consultas") || [];

        
        const nuevaConsulta = {
            id: Date.now().toString(), 
            nombre: nombre,
            email: email,
            telefono: telefono,
            mensaje: mensaje,
            leido: false 
        };

        
        consultas.push(nuevaConsulta);

        
        guardarDatos("consultas", consultas);

        
        formulario.reset();
        alert('¡Consulta enviada con éxito! Nos pondremos en contacto pronto.');
    });
});