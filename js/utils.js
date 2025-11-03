
export function botonCerrar(elemento){
    const atributoSeleccionado = document.getElementById(`${elemento}`);
    if(!atributoSeleccionado) return;
    if(atributoSeleccionado.classList.contains('d-flex')){
       atributoSeleccionado.classList.add('d-none');
    }
};
window.botonCerrar = botonCerrar;