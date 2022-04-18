
let fecha = new Date()



console.log(fecha.toLocaleString())

let socket = io.connect();
socket.on('messages', function(data){
    console.log(data);
    render(data);
})
socket.on('products', function(dataProduct){
    console.log('dataproductos',dataProduct);
    renderProducto(dataProduct);
})

function renderProducto(dataProduct) {
    const html = dataProduct.map(function(elem, index){
        return(
            `<div class="productosContenedor" >
            <p>Nombre: ${elem.nombre}</p> </em> 
            <p>Precio: ${elem.precio}</p> </em> 
            <img src='${elem.foto}' width=200px />
            </div>`
        )
    }).join(" ");
    document.getElementById('products').innerHTML = html
}





function render(data) {
    const html = data.map(function(elem, index){
        return(
            `<div class="textoChatContenedor" >
            <strong>${elem.author}</strong> <em>${fecha.toLocaleString()} </em> :
            <em class="textoChat" >${elem.text}</em>
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
function addProducto(){
    let producto = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        foto: document.getElementById('foto').value
    };
    socket.emit('new-product', producto)

    document.getElementById('nombre').value = ''
    document.getElementById('precio').value = ''
    document.getElementById('foto').value = ''
    document.getElementById('texto').focus()

    return false
}