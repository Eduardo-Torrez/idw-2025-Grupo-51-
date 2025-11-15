
export function visualizarForm(titulo, vistaDelFormulario, nombreForm, mensajeError){
    tituloFormulario.innerHTML = `${titulo}`;
    vistaDelFormulario.classList.remove('d-none')
    vistaDelFormulario.scrollIntoView({behavior: 'smooth'});
    nombreForm.reset();
    mensajeError.innerHTML = "";
}

export function generarId(lista){
    let contadorID = 0;
    if(lista.length ===0){
        return contadorID++;
    }else{
      contadorID = parseInt(lista[lista.length-1].id) + 1;
      return contadorID;
    }
}

export function botonCerrar(elemento){
    const atributoSeleccionado = document.getElementById(`${elemento}`);
    if(!atributoSeleccionado) return;
    if(atributoSeleccionado.classList.contains('d-flex')){
        atributoSeleccionado.classList.add('d-none');
    }
};
window.botonCerrar = botonCerrar;


export const diasdelasemana = ['Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
export const horariosMatutino = ['08:00','09:00','10:00','11:00','12:00'];
export const horarioVerpertino = ['15:00','16:00','17:00','18:00','19:00'];
