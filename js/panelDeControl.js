// Verifica sesión 
const token = sessionStorage.getItem("token");
const usuarioLogueado = sessionStorage.getItem("usuarioLogueado");
console.log("panelDeControl - sesión:", { token, usuarioLogueado });
if (!token || !usuarioLogueado) {
  console.warn("No hay sesión activa. Redirigiendo a login...");
  window.location.href = "login.html";
}


function getArray(...keys) {
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
    }
  }
  return [];
}

function setCount(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = String(arr && arr.length ? arr.length : 0).padStart(2, "0");
}


document.addEventListener("DOMContentLoaded", function () {
  const userEl = document.getElementById("usuario-nombre");
  if (userEl) userEl.textContent = usuarioLogueado || "";

  const toggleBtn = document.querySelector(".toggle-sidebar-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => document.body.classList.toggle("toggle-sidebar"));
  }

  // carga los datos desde localStorage
  const profesionales = getArray("medicos", "profesionales", "listaProfesionales");
  const especialidades = getArray("especialidades");
  const reservas = getArray("reservas", "turnos");
  const consultas = getArray("consultas", "mensajes");

  setCount("cantidad-profesionales", profesionales);
  setCount("cantidad-especialidades", especialidades);
  setCount("cantidad-turnos", reservas);
  setCount("cantidad-consultas", consultas);

  console.log("panelDeControl:", {
    profesionales: profesionales.length,
    especialidades: especialidades.length,
    reservas: reservas.length,
    consultas: consultas.length,
  });
});