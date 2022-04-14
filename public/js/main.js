
let fecha = new Date()



console.log(fecha.toLocaleString())

let socket = io.connect();
socket.on('messages', function(data){
    console.log(data);
    render(data);
})




function render(data) {
    const html = data.map(function(elem, index){
        return(
            `<div>
            <strong>${elem.author}</strong> <em>${fecha.toLocaleString()} </em> :
            <em>${elem.text}</em>
            </div>`
        )
    }).join(" ");
    document.getElementById('messages').innerHTML = html
}

function addMessage(){
    let mensaje = {
        author: document.getElementById('usuario').value,
        text: document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje)

    document.getElementById('texto').value = ''
    document.getElementById('texto').focus()

    return false
}