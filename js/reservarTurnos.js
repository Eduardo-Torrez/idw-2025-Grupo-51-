import { guardarDatos, obtenerDatos } from "./localstorage.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idMedico = params.get("id");

  const medicos = obtenerDatos("medicos") || [];
  const especialidades = obtenerDatos("especialidades") || [];
  const obrasSociales = obtenerDatos("listaObraSociales") || [];
  const turnos = obtenerDatos("turnos") || [];

  if (idMedico) {
    const medico = medicos.find((m) => m.id === idMedico);

    if (medico) {
      const especialidadObj = especialidades.find(
        (e) => e.id === medico.especialidad
      );
      const nombreEspecialidad = especialidadObj
        ? especialidadObj.nombre
        : "Sin especialidad";

      // --- Mostrar info del médico ---
      const medicoInfo = document.getElementById("medico");
      if (medicoInfo) {
        const infoHTML = `
          <h2 style="text-align:left; font-size:1.2rem; margin-bottom:8px;">Reservar turno con:</h2>
          <p style="margin:4px 0;"><strong>Profesional:</strong> ${medico.nombre} ${medico.apellido}</p>
          <p style="margin:4px 0;"><strong>Especialidad:</strong> ${nombreEspecialidad}</p>
          <p style="margin:4px 0;"><strong>Matrícula:</strong> ${medico.matricula}</p>
          <p style="margin:4px 0;"><strong>Valor de consulta:</strong> $${medico.valorConsulta}</p>
        `;
        medicoInfo.innerHTML = infoHTML;
      }

      // --- Mensaje automático ---
      const mensajeElem = document.getElementById("mensaje");
      if (mensajeElem && mensajeElem.value.trim() === "") {
        mensajeElem.value = `Consulta con ${medico.nombre} ${medico.apellido}, especialista en ${nombreEspecialidad}.`;
      }

      // --- Obras sociales del médico ---
      const selectObra = document.getElementById("obraSocial");
      if (selectObra) {
        selectObra.innerHTML =
          '<option value="">Seleccioná una obra social</option>';

        if (medico.obraSociales && medico.obraSociales.length > 0) {
          medico.obraSociales.forEach((os) => {
            const obra = obrasSociales.find((o) => o.id === os.id);
            if (obra) {
              const option = document.createElement("option");
              option.value = obra.id;
              option.textContent = `${obra.nombre} (${obra.porcentajeDescuento}% desc.)`;
              selectObra.appendChild(option);
            }
          });
        } else {
          const option = document.createElement("option");
          option.textContent = "Este profesional no acepta obras sociales";
          option.disabled = true;
          selectObra.appendChild(option);
        }
      }

      // --- Turnos del médico ---
      const turnoMedico = turnos.find((t) => t.id_medico === idMedico);
      const selectHora = document.getElementById("hora");
      const inputFecha = document.getElementById("fecha");

      if (inputFecha && selectHora) {
        // Inicializar selectHora
        selectHora.innerHTML = '<option value="">Seleccioná un horario</option>';

        // Si el médico no tiene turnos configurados, mostrar aviso y deshabilitar
        if (!turnoMedico) {
          selectHora.innerHTML =
            '<option value="">No hay turnos configurados para este profesional</option>';
          selectHora.disabled = true;
        } else {
          selectHora.disabled = false;

          const rellenarHorasParaFecha = () => {
            // si no hay fecha seleccionada, limpiar select
            if (!inputFecha.value) {
              selectHora.innerHTML =
                '<option value="">Seleccioná un horario</option>';
              return;
            }

            // Evitar problemas de zona horaria añadiendo tiempo
            const fechaSeleccionada = new Date(inputFecha.value + "T00:00:00");

            // Mapa de días garantizado en el mismo formato que usamos en datos
            const dias = [
              "Domingo",
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
            ];
            const diaCapitalizado = dias[fechaSeleccionada.getDay()];

            selectHora.innerHTML =
              '<option value="">Seleccioná un horario</option>';

            // Comparación normalizada (ignore case) por si los datos están en minúsculas o mayúsculas
            const turnoDia = (turnoMedico.fechayhora || []).find((fh) =>
              fh.dia &&
              fh.dia.toString().toLowerCase() ===
                diaCapitalizado.toLowerCase()
            );

            if (turnoDia) {
              // validar formato hora_inicio/hora_fin
              if (!turnoDia.hora_inicio || !turnoDia.hora_fin) {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Horario mal configurado";
                selectHora.appendChild(option);
                return;
              }

              const inicioParts = turnoDia.hora_inicio.split(":");
              const finParts = turnoDia.hora_fin.split(":");
              const inicio = parseInt(inicioParts[0], 10);
              const fin = parseInt(finParts[0], 10);

              if (isNaN(inicio) || isNaN(fin) || inicio >= fin) {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Horario mal configurado";
                selectHora.appendChild(option);
                return;
              }

              for (let h = inicio; h < fin; h++) {
                const hora = h.toString().padStart(2, "0") + ":00";
                const option = document.createElement("option");
                option.value = hora;
                option.textContent = hora;
                selectHora.appendChild(option);
              }
            } else {
              const option = document.createElement("option");
              option.value = "";
              option.textContent = "No hay turnos disponibles ese día";
              selectHora.appendChild(option);
            }
          };

          inputFecha.addEventListener("change", rellenarHorasParaFecha);

          // Si ya hay una fecha en el input (p. ej. por autocompletado), rellenar ahora
          if (inputFecha.value) {
            rellenarHorasParaFecha();
          }
        }
      }

      // --- Envío del formulario ---
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

          const reserva = {
            nombre,
            email,
            telefono,
            obra,
            dni,
            fecha,
            hora,
            mensaje,
          };

          // <-- modificación: asegurar que reservas sea un array si no existe -->
          const reservas = obtenerDatos("reservas") || [];
          reservas.push(reserva);
          guardarDatos("reservas", reservas);

          alert(`✅ Turno reservado para ${nombre} el ${fecha} a las ${hora}.`);
          form.reset();

          // resetear selectHora tras reservar
          const selectHora = document.getElementById("hora");
          if (selectHora) {
            selectHora.innerHTML = '<option value="">Seleccioná un horario</option>';
          }
        });
      }
    } // fin if (medico)
  } // fin if (idMedico)
}); // fin DOMContentLoaded
