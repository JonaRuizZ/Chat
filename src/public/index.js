const socket = io()


// AL APRETAR ENTER, ENVIAR MENSAJE

const nombreUsuario = document.getElementById('nombreUsuario') // Capturamos el nombre del usuario
const mensajeUsuario = document.getElementById('mensajeUsuario') // Capturamos el mensaje del usuario

// Con el kevento keyup, al apretar un boton hará algo, lo que le digamos
mensajeUsuario.addEventListener('keyup', (e) => {
    // La verdad no se porque se llama code, pero el loco digo que si el codigo es enter, o sea, si apretamos enter entonces...
    if (e.code == 'Enter') {
        if (nombreUsuario.value != '' || mensajeUsuario != '') {

            // Con estos if validando ya podemos enviar el mensaje hacia el servidor emitiendo un evento, para eso vamos a usar nuestra constante socket que tenemos declarada al principio de esta hoja const socket = io()
            // [Socket] = por socket de arriba
            // socket [.emit] = es para emitir el evento
            // socket.emit [ ('message', ({ })) ] = message es el nombre del evento que vamos a emitir (el mismo nombre usaremos en socket.js cuando queramos mostrar estos datos enviados al servidor) y el segundo parametro los datos que vamos a enviar, pueden ser datos numericos, valores textos, incluso un objeto (es lo que vamos a hacer) vamos a enviar username: y message: que van a ser lo que el usuario escriba
            // Es así como se envía los datos al SERVIDOR, ahora nos queda recibir esos datos en nuestro archivo socket.js, vaaamos para allá
            socket.emit('message', {
                username: nombreUsuario.value,
                message: mensajeUsuario.value.slice(0, -1) // Muestra k\n al final de los mensajes, con slice los borra
            })
            // Reseteamos los valores del mensaje, para que despues de apretar enter, se ponga vacío
            mensajeUsuario.value = ''
        }
    }
})



// MOSTRAR USUARIO NUEVO SE HA CONECTADO, lo hemos llamado en socket.js 'new-user' y menssage le estamos diciendo acá que será el 'Nuevo usuario conectado al chat'
const new_user = document.getElementById('new_user')
socket.on('new_user', (message) => {
    console.log(message)
    let content = `<div class="alert alert-success" role="alert"> Nuevo usuario logeado </div>`
    new_user.innerHTML = content
    setTimeout(() => {
        new_user.innerHTML = ''
    }, 3000)
})



// MOSTRAR CUANDO EL USUARIO ESTÁ ESCRIBIENDO
const writing = document.getElementById('div_writing')

mensajeUsuario.addEventListener('keydown', (e) => {
    if(nombreUsuario.value != ''){
        socket.emit('writing', nombreUsuario.value) // EStamos enviando desde el cliente al servidor (socket.js) el nombre del evento que es writing y ademas dentro de writing estamos enviando el nombre de usuario
    }
})


// Acá estamos escuchando el evento writing que viene del servidor obtendrémos el nombreUsuario que será quien está escribiendo, básicamente acá solo dibujamos como queremos mostrar el mensaje de que alguien está escribiendo
socket.on('writing', (nombreUsuario) => {
    writing.innerHTML = `${nombreUsuario} está escribiendo`
    setTimeout(() => {
        writing.innerHTML = ''
    }, 3000)
})



// MOSTRAR TODOS LOS MENSAJES EN UN DIV (USUARIO + MENSAJE)
const all_messages = document.getElementById('all_messages')

// Lo que estamos haciendo acá es escuchar un evento llamado messages, esto ejecutará la función que tiene como parametro los datos que están enviando desde el servidor (messages), una vez que tenga los datos los imprimimos por consola con un for
socket.on('messages', (messages) => {
    let content = ''
    for (let i = 0; i < messages.length; i++) {
        console.log(messages[i])
        content +=
            `
            <div>
                ${messages[i].username}:
                ${messages[i].message}
            </div>
        `
    }
    all_messages.innerHTML = content

    // Para que el scroll esté siempre abajo (porque habrán nuevos mensajes siempre), está este código
    all_messages.scrollTop = all_messages.scrollHeight
})
