//funcion asicrona expotable
export async function login(userParam,passParam) {
    try{
        //obtengo todo los datos de la appi
        const response= await fetch('https://dummyjson.com/auth/login',{
            method:'POST',
            headers : {
                'Contert-type' : 'application/json'
            },
            //lo parceo a string
            body:JSON.stringify({
                username: userParam,
                password: passParam
            })
        });
        if (!response.ok){
            console.error('error');
                return false;
        }
        const data=await response.json();
        return data;

    }catch(error){
        console.error('error');
        return false;

    }
}