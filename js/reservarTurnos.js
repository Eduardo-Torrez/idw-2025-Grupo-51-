import { guardarDatos, obtenerDatos } from "./localstorage.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- 1) Mostrar el profesional pasado por la URL (si existe) ---
  const params = new URLSearchParams(window.location.search);
  const nombreProfesional = params.get("nombre");
  const especialidadProfesional = params.get("especialidad");

  if (nombreProfesional || especialidadProfesional) {
    const medicoInfo = document.getElementById("medico");

    if (medicoInfo) {
      const partes = [];
      if (nombreProfesional) partes.push(nombreProfesional);
      if (especialidadProfesional) partes.push(`especialista en ${especialidadProfesional}`);
      medicoInfo.textContent = `Estás reservando un turno con ${partes.join(", ")}.`;
    }

    const mensajeElem = document.getElementById("mensaje");
    if (mensajeElem && nombreProfesional) {
      if (mensajeElem.value.trim() === "") {
        mensajeElem.value = `Consulta con ${nombreProfesional}${especialidadProfesional ? `, ${especialidadProfesional}` : ""}.`;
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

      const reservas = obtenerDatos("reservas"); // devuelve [] si no hay nada
      reservas.push(reserva);
      guardarDatos("reservas", reservas);

      alert(`✅ Turno reservado para ${nombre} el ${fecha} a las ${hora}.`);

      form.reset();
    });
  }

  // --- 3) Mostrar las reservas en una tabla si existe ---
  const tablaReservas = document.getElementById("tablaReservas");
  if (tablaReservas) {
    listarReservas();
  }
});

// --- Función para listar reservas ---
function listarReservas() {
  const tabla = document.getElementById("tablaReservas");
  if (!tabla) return;

  const reservas = obtenerDatos("reservas") || [];

  tabla.innerHTML = "";

  if (reservas.length === 0) {
    tabla.innerHTML = `<tr><td colspan="8" class="text-center">No hay reservas cargadas</td></tr>`;
    return;
  }

  reservas.forEach((r, index) => {
    const fila = document.createElement("tr");
    fila.classList.add("text-center", "align-middle");
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${r.nombre}</td>
      <td>${r.email}</td>
      <td>${r.telefono}</td>
      <td>${r.obra}</td>
      <td>${r.fecha}</td>
      <td>${r.hora}</td>
      <td>${r.mensaje}</td>
    `;
    tabla.appendChild(fila);
  });
}
