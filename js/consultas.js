// js/consultas.js

import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar } from "./utils.js";


// 1. Cargar las consultas (o un array vacío si no hay)
let consultas = obtenerDatos("consultas") || [];

// --- Función principal para mostrar las consultas en la tabla ---
function listarConsultas() {
    let tablaConsultas = document.getElementById('tablaConsultas');
    let totalConsultas = document.getElementById('totalConsultas');
    
    tablaConsultas.innerHTML = ''; // Limpiar la tabla antes de dibujarla

    // Si no hay consultas, mostrar un mensaje
    if (consultas.length === 0) {
        totalConsultas.innerHTML = 'No hay consultas para mostrar.';
        tablaConsultas.innerHTML = '<tr><td colspan="6" class="text-center">No hay consultas recibidas.</td></tr>';
        return;
    }

    // Actualizar el contador
    const noLeidas = consultas.filter(c => !c.leido).length;
    totalConsultas.innerHTML = `Total ${consultas.length} consultas (${noLeidas} no leídas).`;

    // 2. Recorrer el array de consultas
    consultas.forEach((consulta) => {
        let fila = document.createElement('tr');
        fila.style.textAlign = "center";
        
        // Si la consulta está leída, la atenuamos
        if (consulta.leido) {
            fila.classList.add('text-muted');
            fila.style.backgroundColor = '#f8f9fa'; // Un gris claro
        }

        const sobreAbierto = consultaActual === consulta.id;

        // 3. Crear cada celda (td)
       fila.innerHTML = `
            <td>${consulta.id}</td>
            <td>${consulta.nombre}</td>
            <td><a href="mailto:${consulta.email}">${consulta.email}</a></td>
            <td>${consulta.telefono}</td>
            <td style="min-width: 300px; text-align: left;">${consulta.mensaje}</td>
            <td>
                <div class="d-flex flex-column flex-lg-row justify-content-center gap-2 acciones">
                    <button class="btn btn-outline btn-leido" data-id="${consulta.id}" title="'Leer mensaje'}">
                        <i class="bi ${sobreAbierto ? 'bi-envelope-open' : 'bi-envelope'}"></i>
                    </button>
                    
                    <button class="btn btn-outline btn-eliminar" data-id="${consulta.id}" title="Eliminar consulta">
                        <i class="bi bi-trash"></i>
                    </button>

                </div>
            </td>
        `;
        
        tablaConsultas.appendChild(fila);

    });

    // 5. Asignar las funciones a los botones creados
    asignarEventosBotones();
}

// --- Función para asignar los clics a los botones ---
function asignarEventosBotones() {
    // Botones de Leído/No Leído
    document.querySelectorAll('.btn-leido').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            marcarLeida(id);
        });
    });

    // Botones de Eliminar
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            eliminarConsulta(id);
        });
    });
}


// --- Función para eliminar una consulta ---
function eliminarConsulta(id) {
    let consulta = consultas.find(c => c.id === id); // Busca para mostrar el nombre
    
    if (confirm(`¿Está seguro que quiere eliminar la consulta de ${consulta.nombre}?`)) {
        consultas = consultas.filter(c => c.id !== id); // Filtra y deja todas MENOS esa
        guardarDatos("consultas", consultas); // Guarda el array sin la consulta eliminada
        listarConsultas(); // Vuelve a dibujar la tabla
        location.reload();
    }
}


let consultaActual = null;
let vistaDeTarjetaProfesional = document.getElementById('card-vista');
const nombreVista= document.getElementById('vista-nombre');
const emailVista = document.getElementById('vista-email');
const telefonoVista= document.getElementById('vista-telefono');
const mensajeVista= document.getElementById('vista-mensaje');

// --- Función para cambiar el estado leído/no leído ---
function marcarLeida(id) {
    const consulta = consultas.find(c => c.id === id);
    if (!consulta) return;

    // Marcar la consulta como leída
    if (!consulta.leido) {
        consulta.leido = true;
        guardarDatos("consultas", consultas);
    }

    // Guardar la consulta actual para controlar el icono del sobre
    consultaActual = consulta.id;

    // Mostrar tarjeta
    vistaDeTarjetaProfesional.classList.remove('d-none');
    vistaDeTarjetaProfesional.scrollIntoView({behavior: 'smooth'});

    nombreVista.innerHTML = consulta.nombre;
    emailVista.innerHTML = consulta.email;
    telefonoVista.innerHTML = consulta.telefono;
    mensajeVista.innerHTML = consulta.mensaje;

    // Actualizar tabla para reflejar sobre abierto
    listarConsultas();
}

document.querySelectorAll('.botonCerrar').forEach(boton=>{
    boton.addEventListener('click', ()=>{
        const targetId = boton.dataset.target;
        botonCerrar(targetId);


        consultaActual = null; // limpiar el estado
        listarConsultas();
        
    })
});



// --- Carga inicial al abrir la página ---
listarConsultas();