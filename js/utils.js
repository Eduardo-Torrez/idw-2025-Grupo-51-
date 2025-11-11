
export function botonCerrar(elemento){
    const atributoSeleccionado = document.getElementById(`${elemento}`);
    if(!atributoSeleccionado) return;
    if(atributoSeleccionado.classList.contains('d-flex')){
       atributoSeleccionado.classList.add('d-none');
    }
};
window.botonCerrar = botonCerrar;


export const diasdelasemana = ['Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
export const horarios = ['08:00','09:00','10:00','11:00','12:00','16:00','17:00','18:00','19:00','20:00'];
