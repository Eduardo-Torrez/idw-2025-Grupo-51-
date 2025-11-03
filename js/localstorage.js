export function guardarDatos(clave, valor){
    return localStorage.setItem(clave, JSON.stringify(valor));
}


export function obtenerDatos(clave){
    return JSON.parse(localStorage.getItem(clave)) || [];
}