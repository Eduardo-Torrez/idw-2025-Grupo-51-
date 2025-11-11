import { guardarDatos, obtenerDatos } from "./localstorage.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- 1) Mostrar el profesional pasado por la URL (ahora usamos id) --- // CAMBIO
  const params = new URLSearchParams(window.location.search);
  const idMedico = params.get("id"); // CAMBIO

  if (idMedico) { // CAMBIO
    const medicos = obtenerDatos("medicos") || []; // CAMBIO
    const especialidades = obtenerDatos("especialidades") || []; // CAMBIO
    const medico = medicos.find(m => m.id === idMedico); // CAMBIO

    if (medico) { // CAMBIO
      const especialidadObj = especialidades.find(e => e.id === medico.especialidad); // CAMBIO
      const nombreEspecialidad = especialidadObj ? especialidadObj.nombre : "Sin especialidad"; // CAMBIO

      const medicoInfo = document.getElementById("medico");
      if (medicoInfo) {

        const infoHTML = `
          <h2>Reservar turno con:</h2>
          <p><strong>Profesional:</strong> ${medico.nombre} ${medico.apellido}</p>
          <p><strong>Especialidad:</strong> ${nombreEspecialidad}</p>
          <p><strong>Matrícula:</strong> ${medico.matricula}</p>
          <p><strong>Valor de consulta:</strong> $${medico.valorConsulta}</p>
          
        `;
        medicoInfo.innerHTML = infoHTML; 
      }

      const mensajeElem = document.getElementById("mensaje");
      if (mensajeElem && mensajeElem.value.trim() === "") {
        mensajeElem.value = `Consulta con ${medico.nombre} ${medico.apellido}, especialista en ${nombreEspecialidad}.`;
      }


    }
  }

  // --- 2) Manejo del submit del formulario ---
  const form = document.getElementById("formReserva");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("telefono").value.trim();
      const obra = document.getElementById("obraSocial").value;
      const dni = document.getElementById("dni").value.trim();
      const fecha = document.getElementById("fecha").value;
      const hora = document.getElementById("hora").value;
      const mensaje = document.getElementById("mensaje").value.trim();

      if (!email.includes("@")) {
        alert("El correo no es válido");
        return false;
      }

      const reserva = { nombre, email, telefono, obra, dni, fecha, hora, mensaje };

      const reservas = obtenerDatos("reservas");
      reservas.push(reserva);
      guardarDatos("reservas", reservas);

      alert(`✅ Turno reservado para ${nombre} el ${fecha} a las ${hora}.`);

      form.reset();
    });
  }

  // --- 3) Eliminado código innecesario de listado de reservas --- // CAMBIO
});
