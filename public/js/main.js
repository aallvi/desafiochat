
let fecha = new Date()



console.log(fecha.toLocaleString())

let socket = io.connect();
socket.on('messages', function(data){
    console.log('y esto',data);
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
            <strong>${elem.author.nombre}</strong> <em>${fecha.toLocaleString()} </em> :
            <em class="textoChat" >${elem.mensaje}</em>
            </div>`
        )
    }).join(" ");
    document.getElementById('messages').innerHTML = html
}

function addMessage(){
    let mensajeObj = {
        author:{
         id:document.getElementById('id').value,
         nombre:document.getElementById('name').value,
         apellido:document.getElementById('apellido').value,
         edad:document.getElementById('edad').value,
         alias:document.getElementById('alias').value,
         avatar:document.getElementById('avatar').value,
        },
       
        mensaje: document.getElementById('men').value
    };
    socket.emit('new-message', mensajeObj)

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