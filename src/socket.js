module.exports = (io) => {
    let messages = []

    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado')

        // Si un usuario nuevo se conecta al chat podrá ver el historial del chat gracias a este código:
        io.emit('messages', messages)

        // Si un usuario nuevo se conecta, mostrar por consola que se ha conectado
        socket.broadcast.emit('new_user', 'Nuevo usuario conectado al chat')

        // Acá escuchamos el evento writing y le estamos asignando como nombre username al nombreUsuario.value que estamos pasando en el index
        socket.on('writing', (username) => {
            socket.broadcast.emit('writing', username)
        })

        // Acá es donde escuchamos lo que hace el cliente, en este caso si emite un message (asi lo llamamo en index.js en el socket.emit), y de parametro le damos la data, que sería el objeto que contiene usuario y su mensaje 
        socket.on('message', (data) => {
            messages.push(data) //Agregamos al array el mensaje del usuario
            io.emit('messages', messages)
        })

        // Ahora a diferencia de arriba, vamos a escuchar ese evento a partir de el parametro socket o sea desde nuestro cliente, vamos a escuchar cuando nuestro cliente realice un evento de tipo disconnect y esto devuelve una función, que hará un console log, nada más
        socket.on('disconnect', () => {
            console.log('Usuario desconectado')
        })
    })
}