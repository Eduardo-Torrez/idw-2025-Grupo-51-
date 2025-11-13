document.addEventListener('DOMContentLoaded',async()=>{
    const tablaUsuariosBody=document.querySelector('#tablaUsuarios tbody')
    try{
        const response= await fetch('https://dummyjson.com/users');
        if(response.ok){
            //obtengo los datos de la lista json
            const data= await response.json();
            //estoy dentro del diccionario de la appi formato array
            const usuarios=data.users;
            // muestro todo los usuarios registrados 
            usuarios.forEach((element)=>{

                //solo mostramos para no estar buscando la contraseña por appi
                const fila=document.createElement('tr');
                fila.innerHTML=`
                <td>${element.firstName}</td>
                <td>${element.lastName}</td>
                <td> <input style=" border: none; font-size:1.2rem; width:100%;" type="password" value="${element.password}" readonly></td> 
                <td>${element.email}</td>
                <td>${element.phone}</td>
        `;

        tablaUsuariosBody.appendChild(fila);
            });
        }else{
            console.error(response.status);
            throw Error("Error al lista usuarios");
        }
    }catch(error){
            console.error("error,error");
            alert("Error en la api Dummy");
    }
})