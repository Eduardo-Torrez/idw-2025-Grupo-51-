import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar } from "./utils.js";

let reservas = obtenerDatos("reservas");

const tablaReservas = document.getElementById("tablaReservas");
const totalReservas = document.getElementById("totalReservas");
const vistaFormulario = document.getElementById("vista-formulario-modificar");

// Campos del formulario de edición
const nombreModificar = document.getElementById("nombreModificar");
const emailModificar = document.getElementById("emailModificar");
const telefonoModificar = document.getElementById("telefonoModificar");
const dniModificar = document.getElementById("dniModificar");
const obraModificar = document.getElementById("obraModificar");
const fechaModificar = document.getElementById("fechaModificar");
const horaModificar = document.getElementById("horaModificar");
const mensajeModificar = document.getElementById("mensajeModificar");
const mensajeError = document.getElementById("mensajeError");

let reservaSeleccionada = null;


function listarReservas() {
  tablaReservas.innerHTML = "";

  if (reservas.length === 0) {
    totalReservas.textContent = "No hay reservas registradas.";
    return;
  }

  totalReservas.textContent = `Total de reservas: ${reservas.length}`;

  reservas.forEach((reserva, index) => {
    const fila = document.createElement("tr");
    fila.classList.add("text-center", "align-middle");

    // Crear celdas
    const id = document.createElement("td");
    id.textContent = index + 1;

    const nombre = document.createElement("td");
    nombre.textContent = reserva.nombre;

    const email = document.createElement("td");
    email.textContent = reserva.email;

    const telefono = document.createElement("td");
    telefono.textContent = reserva.telefono;

    const obra = document.createElement("td");
    obra.textContent = reserva.obra;

    const fecha = document.createElement("td");
    fecha.textContent = reserva.fecha;

    const hora = document.createElement("td");
    hora.textContent = reserva.hora;

    const mensaje = document.createElement("td");
    mensaje.textContent = reserva.mensaje;

    // Crear botones de acción
    const botones = document.createElement("td");
    const div = document.createElement("div");
    div.classList.add("d-flex", "flex-column", "flex-lg-row", "justify-content-center", "gap-2", "acciones");

    // BOTÓN ELIMINAR
    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("btn", "btn-outline");
    botonEliminar.innerHTML = '<i class="bi bi-trash"></i>';
    botonEliminar.addEventListener("click", () => eliminarReserva(index));

    // BOTÓN EDITAR
    const botonEditar = document.createElement("button");
    botonEditar.classList.add("btn", "btn-outline");
    botonEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';
    botonEditar.addEventListener("click", () => editarReserva(index));

    // BOTÓN VISUALIZAR
    const botonVer = document.createElement("button");
    botonVer.classList.add("btn", "btn-outline");
    botonVer.innerHTML = '<i class="bi bi-eye"></i>';
    botonVer.addEventListener("click", () => visualizarReserva(index));

    // Agregar botones al div
    div.appendChild(botonEliminar);
    div.appendChild(botonEditar);
    div.appendChild(botonVer);
    botones.appendChild(div);

    // Agregar celdas a la fila
    fila.appendChild(id);
    fila.appendChild(nombre);
    fila.appendChild(email);
    fila.appendChild(telefono);
    fila.appendChild(obra);
    fila.appendChild(fecha);
    fila.appendChild(hora);
    fila.appendChild(mensaje);
    fila.appendChild(botones);

    tablaReservas.appendChild(fila);
  });
}

listarReservas();



function eliminarReserva(index) {
  const reserva = reservas[index];
  if (confirm(`¿Está seguro que quiere eliminar la reserva de ${reserva.nombre}?`)) {
    reservas.splice(index, 1);
    guardarDatos("reservas", reservas);
    listarReservas();
    alert("✅ Reserva eliminada correctamente");
  }
}


function editarReserva(index) {
  reservaSeleccionada = reservas[index];
  vistaFormulario.classList.remove("d-none");

  // Rellenar campos
  nombreModificar.value = reservaSeleccionada.nombre;
  emailModificar.value = reservaSeleccionada.email;
  telefonoModificar.value = reservaSeleccionada.telefono;
  dniModificar.value = reservaSeleccionada.dni;
  obraModificar.value = reservaSeleccionada.obra;
  fechaModificar.value = reservaSeleccionada.fecha;
  horaModificar.value = reservaSeleccionada.hora;
  mensajeModificar.value = reservaSeleccionada.mensaje;
}


function visualizarReserva(index) {
  const reserva = reservas[index];
  alert(`
📋 Reserva N° ${index + 1}

👤 Nombre: ${reserva.nombre}
📧 Email: ${reserva.email}
📞 Teléfono: ${reserva.telefono}
🪪 DNI: ${reserva.dni}
🏥 Obra social: ${reserva.obra}
📅 Fecha: ${reserva.fecha}
⏰ Hora: ${reserva.hora}
💬 Motivo: ${reserva.mensaje}
`);
}


const formularioModificar = document.getElementById("formulario-modificar");
if (formularioModificar) {
  formularioModificar.addEventListener("submit", (e) => {
    e.preventDefault();

   
    if (!nombreModificar.value || !emailModificar.value || !telefonoModificar.value) {
      mensajeError.textContent = "Por favor completá todos los campos obligatorios.";
      return;
    }

 
    reservaSeleccionada.nombre = nombreModificar.value.trim();
    reservaSeleccionada.email = emailModificar.value.trim();
    reservaSeleccionada.telefono = telefonoModificar.value.trim();
    reservaSeleccionada.dni = dniModificar.value.trim();
    reservaSeleccionada.obra = obraModificar.value.trim();
    reservaSeleccionada.fecha = fechaModificar.value;
    reservaSeleccionada.hora = horaModificar.value;
    reservaSeleccionada.mensaje = mensajeModificar.value.trim();

    guardarDatos("reservas", reservas);
    listarReservas();

    vistaFormulario.classList.add("d-none");
    formularioModificar.reset();
    alert("✅ Reserva actualizada correctamente");
    botonCerrar('vista-formulario-modificar');
  });
  
}

document.querySelectorAll('.botonCerrar').forEach(boton=>{
    boton.addEventListener('click', ()=>{
        const targetId = boton.dataset.target;
        botonCerrar(targetId);
        
    })
});




