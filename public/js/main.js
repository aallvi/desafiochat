

const valor = document.getElementById("texto")

valor.addEventListener('keyup', (event) => {
    var inputText =event.path[0].value

    console.log(inputText)

    document.querySelector('#enlaceLogin').innerHTML= `<a href="http://localhost:8080/login/${inputText}" > Entra </a>`

} )

// console.log(valor)
    const enlace = `<a href="http://localhost:8080/login/${valor}" > Entra </a> `

    // document.getElementById('enlaceLogin').appendChild(enlace)
  
  
    // const para = document.createElement("p");
    // const node = document.createTextNode("This is new.");
    // para.appendChild(node);
    
    // const element = document.getElementById("div1");
    // element.appendChild(para);
  

    document.querySelector('#enlaceLogin').innerHTML= '<a href="http://localhost:8080/login/${valor}" > Entra </a>'

// let fecha = new Date()

const obtenerNombre = () => {

  let usuario = {nombre:'nada'}

  fetch('http://localhost:8080/nombreUsuario')
  .then(response => response.json())
  .then(data => {
     if(data.nombre){
      document.querySelector('#enlaceLogin').innerHTML= `<p > Hola ${data.nombre}  </p>`
      document.querySelector('#texto').remove()
      document.querySelector('#nombreinput').remove()
      document.querySelector('#salir').innerHTML= `<a href="http://localhost:8080/logout" > salir </a>`


     } else {
      console.log(data)
     }


  }
  
  ).catch(err => console.log(err));
    


}

obtenerNombre()




// console.log(fecha.toLocaleString())

// let socket = io.connect();
// socket.on('messages', function(data){
//     console.log('y esto',data);
//     render(data);
// })


// socket.on('products', function(dataProduct){
//     console.log('dataproductos',dataProduct);
//     renderProducto(dataProduct);
// })




// console.log('valor nombr', valor)


 


// function renderProducto(dataProduct) {
//     const html = dataProduct.map(function(elem, index){
//         return(
//             `<div class="productosContenedor" >
//             <p>Nombre: ${elem.nombre}</p> </em> 
//             <p>Precio: ${elem.precio}</p> </em> 
//             <img src='${elem.foto}' width=200px />
//             </div>`
//         )
//     }).join(" ");
//     document.getElementById('products').innerHTML = html
// }





// function render(data) {
//     const html = data.map(function(elem, index){
//         return(
//             `<div class="textoChatContenedor" >
//             <strong>${elem.author.nombre}</strong> <em>${fecha.toLocaleString()} </em> :
//             <em class="textoChat" >${elem.mensaje}</em>
//             </div>`
//         )
//     }).join(" ");
//     document.getElementById('messages').innerHTML = html
// }

// function addMessage(){
//     let mensajeObj = {
//         author:{
//          id:document.getElementById('id').value,
//          nombre:document.getElementById('name').value,
//          apellido:document.getElementById('apellido').value,
//          edad:document.getElementById('edad').value,
//          alias:document.getElementById('alias').value,
//          avatar:document.getElementById('avatar').value,
//         },
       
//         mensaje: document.getElementById('men').value
//     };
//     socket.emit('new-message', mensajeObj)

//     document.getElementById('texto').value = ''
//     document.getElementById('texto').focus()

//     return false
// }
// function addProducto(){
//     let producto = {
//         nombre: document.getElementById('nombre').value,
//         precio: document.getElementById('precio').value,
//         foto: document.getElementById('foto').value
//     };
//     socket.emit('new-product', producto)

//     document.getElementById('nombre').value = ''
//     document.getElementById('precio').value = ''
//     document.getElementById('foto').value = ''
//     document.getElementById('texto').focus()

//     return false
// }