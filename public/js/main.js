



// const nombre = document.getElementById("nombre").value
// const clave = document.getElementById("clave").value
const myBtn = document.getElementById("myBtn")

myBtn.addEventListener('click', function() {
    // var inputText =event.path[0].value

    console.log(document.getElementById("clave").value)
    console.log(document.getElementById("nombre").value)

    let nombre = document.getElementById("nombre").value
    let clave = document.getElementById("clave").value
   


    console.log(nombre)
    console.log(clave)

    let usuario = {
      username: nombre,
      password: clave
    }

 

    fetch(`http://localhost:8080/register`,
    {   
    method: "POST",
    body: JSON.stringify(usuario),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      
  
  })
    .then(response => {
      console.log(response)

      
    
    } ).then( window.location.href("http://localhost:8080/home") )
   
    
    
    .catch(err => console.log(err) );

    // document.querySelector('#enlaceLogin').innerHTML= `<a href="http://localhost:8080/register/${inputText}/${clave}" > Entra </a>`

} )

const myBtnInicio = document.getElementById("myBtnInicio")

myBtnInicio.addEventListener('click', function() {
    // var inputText =event.path[0].value



    let nombre = document.getElementById("textoLogin").value
    let clave = document.getElementById("claveLogin").value
   


    console.log(nombre)
    console.log(clave)

    let usuario = {
      username: nombre,
      password: clave
    }

 

    fetch(`http://localhost:8080/login`,
    {   
    method: "POST",
    body: JSON.stringify(usuario),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      
  
  })
    .then(response => {
      console.log(response)

      
    
    } ).then( window.location.href("http://localhost:8080/home") )
   
    
    
    .catch(err => console.log(err) );

    // document.querySelector('#enlaceLogin').innerHTML= `<a href="http://localhost:8080/register/${inputText}/${clave}" > Entra </a>`

} )




// console.log(valor)
 

    // document.getElementById('enlaceLogin').appendChild(enlace)
  
  
    // const para = document.createElement("p");
    // const node = document.createTextNode("This is new.");
    // para.appendChild(node);
    
    // const element = document.getElementById("div1");
    // element.appendChild(para);
  

   
    // document.querySelector('#enlaceRegister').innerHTML= '<a href="http://localhost:8080/register" > Registrate </a> '

// let fecha = new Date()






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