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
          option.value = "0";
          option.textContent = "No acepta obras sociales";
          option.selected = true;
          selectObra.appendChild(option);
        }
    }

      // --- Turnos del médico ---
      const turnoMedico = turnos.find((t) => t.id_medico === idMedico);
      const selectHora = document.getElementById("hora");
      const selectFecha = document.getElementById("fecha");


      /* Los turnos se sacan para el mes siguiente */
      function configurarRangoFechas(select, turnoMedico) {
        if (!turnoMedico) {
          select.innerHTML = '<option value="">No hay fechas disponibles</option>';
          return;
        }
        const hoy = new Date();
        const primerDiaMesSiguiente = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
        const ultimoDiaMesSiguiente = new Date(hoy.getFullYear(), hoy.getMonth() + 2, 0);

        select.innerHTML = '<option value="">Seleccioná una fecha</option>';
        //Traemos los dias que atiende el profesional y que estan guardados en localstorage
        const diasDeAtencion = (turnoMedico.fechayhora || []).map(fh => parseInt(fh.dia));
        let fecha = new Date(primerDiaMesSiguiente);
        while (fecha <= ultimoDiaMesSiguiente) {
          const diaLocalStorage = fecha.getDay();
          // se agregan únicamente los dias que coinciden
          if (diasDeAtencion.includes(diaLocalStorage)) {
            const option = document.createElement("option");
            option.value = fecha.toISOString().split("T")[0];
            option.textContent = fecha.toLocaleDateString("es-AR");
            select.appendChild(option);
          }
          fecha.setDate(fecha.getDate() + 1);
        }
    }


    // Llenar fechas al cargar
    configurarRangoFechas(selectFecha, turnoMedico);

    if (selectFecha && selectHora) {
      selectHora.innerHTML = '<option value="">Seleccioná un horario</option>';

      if (!turnoMedico) {
          selectHora.innerHTML =
              '<option value="">No hay turnos configurados para este profesional</option>';
          selectHora.disabled = true;
      } else {
          selectHora.disabled = false;

          const rellenarHorasParaFecha = () => {
            if (!selectFecha.value) {
              selectHora.innerHTML = '<option value="">Seleccioná un horario</option>';
              return;
            }

            const fechaSeleccionada = new Date(selectFecha.value + "T00:00:00");
            const diaNumero = fechaSeleccionada.getDay();

            const turnosDelDia = (turnoMedico.fechayhora || []).filter(
              fh => parseInt(fh.dia) === diaNumero
            );

            if (turnosDelDia.length > 0) {
              turnosDelDia.forEach(turno => {
                const inicio = parseInt(turno.hora_inicio.split(":")[0], 10);
                const fin = parseInt(turno.hora_fin.split(":")[0], 10);

                for (let h = inicio; h < fin; h++) {
                  const hora = h.toString().padStart(2, "0") + ":00";
                  const option = document.createElement("option");
                  option.value = hora;
                  option.textContent = hora;
                  selectHora.appendChild(option);
                }
              });
            } else {
              const option = document.createElement("option");
              option.value = "";
              option.textContent = "No hay turnos disponibles ese día";
              selectHora.appendChild(option);
            }
        };

        selectFecha.addEventListener("change", rellenarHorasParaFecha);
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
