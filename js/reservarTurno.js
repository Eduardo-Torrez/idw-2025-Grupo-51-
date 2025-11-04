// Espera que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formReserva");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); 


    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const dni = document.getElementById("dni").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const mensaje = document.getElementById("mensaje").value;

    const reserva = { nombre, email, telefono, dni, fecha, hora, mensaje };

    // Guarda en LocalStorage
    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));
  
    alert(`✅ Turno reservado para ${nombre} el ${fecha} a las ${hora}.`);

    form.reset();
  });
});
