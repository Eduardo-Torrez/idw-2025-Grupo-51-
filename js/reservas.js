import { guardarDatos, obtenerDatos } from "./localstorage.js";
import { botonCerrar } from "./utils.js";

let reservas = obtenerDatos("reservas") || [];
const medicos = obtenerDatos("medicos") || [];
const obrasSociales = obtenerDatos("listaObraSociales") || [];

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

function formatoMoneda(v) {
  // acepta "40.000", "40000" o number y devuelve "$40.000"
  if (typeof v === "number") v = String(Math.round(v));
  const digits = String(v || "").replace(/\D/g, ""); // deja sólo dígitos
  const n = digits ? parseInt(digits, 10) : 0;
  return "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function calcularValorReserva(reserva) {
  if (reserva.valor_total !== undefined && reserva.valor_total !== null) {
    const raw = reserva.valor_total;
    const s = String(raw).replace(/\./g, "").replace(/,/g, ".");
    return Number(s) || 0;
  }

  const obraId = reserva.obra || reserva.obra_social || reserva.obra;
  const obraObj = obrasSociales.find((o) => o.id === obraId);
  const descuento = obraObj ? Number(String(obraObj.porcentajeDescuento || 0).replace(/\./g, "").replace(/,/g, ".")) : 0;

  let medico = null;
  if (reserva.medico_id) medico = medicos.find((m) => m.id === reserva.medico_id);
  if (!medico && reserva.especialidad) medico = medicos.find((m) => m.especialidad === reserva.especialidad);
  if (!medico && medicos.length > 0) medico = medicos[0];

  const rawValor = medico ? medico.valorConsulta : 0;
  const valorConsulta = Number(String(rawValor).replace(/\./g, "").replace(/,/g, ".")) || 0;

  const total = valorConsulta * (1 - (descuento || 0) / 100);
  return total; 
}

function listarReservas() {
  tablaReservas.innerHTML = "";

  if (!reservas || reservas.length === 0) {
    totalReservas.textContent = "No hay reservas registradas.";
    return;
  }

  totalReservas.textContent = `Total de reservas: ${reservas.length}`;

  reservas.forEach((reserva, index) => {
    const fila = document.createElement("tr");
    fila.classList.add("text-center", "align-middle");

    
    const id = document.createElement("td");
    id.textContent = reserva.id !== undefined && reserva.id !== null ? reserva.id : index + 1;

    const nombre = document.createElement("td");
    nombre.textContent = reserva.nombre || "";

    const email = document.createElement("td");
    email.textContent = reserva.email || "";

    const telefono = document.createElement("td");
    telefono.textContent = reserva.telefono || "";

   
    const dniTd = document.createElement("td");
    dniTd.textContent = reserva.documento || reserva.dni || "";

    const obra = document.createElement("td");
    obra.textContent = reserva.obra || reserva.obra_social || "";

    const fecha = document.createElement("td");
    fecha.textContent = reserva.fecha || "";

    const hora = document.createElement("td");
    hora.textContent = reserva.hora || "";

    const mensaje = document.createElement("td");
    mensaje.textContent = reserva.mensaje || "";

    
    const valor = document.createElement("td");
    const valorCalculado = calcularValorReserva(reserva);
    valor.textContent = formatoMoneda(valorCalculado);

    // Crear botones de acción
    const botones = document.createElement("td");
    const div = document.createElement("div");
    div.classList.add("d-flex", "flex-column", "flex-lg-row", "justify-content-center", "gap-2", "acciones");

    const botonEliminar = document.createElement("button");
    botonEliminar.classList.add("btn", "btn-outline");
    botonEliminar.innerHTML = '<i class="bi bi-trash"></i>';
    botonEliminar.addEventListener("click", () => eliminarReserva(index));

    const botonEditar = document.createElement("button");
    botonEditar.classList.add("btn", "btn-outline");
    botonEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';
    botonEditar.addEventListener("click", () => editarReserva(index));

    const botonVer = document.createElement("button");
    botonVer.classList.add("btn", "btn-outline");
    botonVer.innerHTML = '<i class="bi bi-eye"></i>';
    botonVer.addEventListener("click", () => visualizarReserva(index));

    div.appendChild(botonEliminar);
    div.appendChild(botonEditar);
    div.appendChild(botonVer);
    botones.appendChild(div);

    
    fila.appendChild(id);
    fila.appendChild(nombre);
    fila.appendChild(email);
    fila.appendChild(telefono);
    fila.appendChild(dniTd);
    fila.appendChild(obra);
    fila.appendChild(fecha);
    fila.appendChild(hora);
    fila.appendChild(mensaje);
    fila.appendChild(valor);
    fila.appendChild(botones);

    tablaReservas.appendChild(fila);
  });
}

listarReservas();

function eliminarReserva(index) {
  const reserva = reservas[index];
  if (confirm(`¿Está seguro que quiere eliminar la reserva de ${reserva.nombre || reserva.apellido || reserva.documento || 'este paciente'}?`)) {
    reservas.splice(index, 1);
    guardarDatos("reservas", reservas);
    listarReservas();
    alert("✅ Reserva eliminada correctamente");
  }
}

function editarReserva(index) {
  reservaSeleccionada = reservas[index];
  vistaFormulario.classList.remove("d-none");

  if (nombreModificar) nombreModificar.value = reservaSeleccionada.nombre || "";
  if (emailModificar) emailModificar.value = reservaSeleccionada.email || "";
  if (telefonoModificar) telefonoModificar.value = reservaSeleccionada.telefono || "";
  if (dniModificar) dniModificar.value = reservaSeleccionada.dni || reservaSeleccionada.documento || "";
  if (obraModificar) obraModificar.value = reservaSeleccionada.obra || reservaSeleccionada.obra_social || "";
  if (fechaModificar) fechaModificar.value = reservaSeleccionada.fecha || "";
  if (horaModificar) horaModificar.value = reservaSeleccionada.hora || "";
  if (mensajeModificar) mensajeModificar.value = reservaSeleccionada.mensaje || "";
}

function visualizarReserva(index) {
  const reserva = reservas[index];
  alert(`
📋 Reserva N° ${reserva.id !== undefined && reserva.id !== null ? reserva.id : index + 1}
👤 Apellido y Nombre: ${reserva.apellido || ""} ${reserva.nombre || ""}
📧 Correo electrónico: ${reserva.email || ""}
📞 Teléfono: ${reserva.telefono || ""}
🪪 DNI: ${reserva.documento || reserva.dni || ""}
🏥 Obra social: ${reserva.obra || reserva.obra_social || ""}
📅 Fecha: ${reserva.fecha || ""}
⏰ Hora: ${reserva.hora || ""}
💬 Motivo: ${reserva.mensaje || ""}
💵 Valor total: ${formatoMoneda(calcularValorReserva(reserva))}
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

    const valorModificar = document.getElementById("valorModificar");
    if (valorModificar) {
      const v = parseFloat(valorModificar.value);
      if (!isNaN(v)) reservaSeleccionada.valor_total = Number(v.toFixed(2));
    } else {
      reservaSeleccionada.valor_total = calcularValorReserva(reservaSeleccionada);
    }

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
  });
});




