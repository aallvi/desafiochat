const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)


// app.set('view engine', 'ejs')

// app.set('views', './views')

// app.use(express.json())
// app.use(express.urlencoded({extended:true}))




// ------------------------

let messages = []

app.use(express.static('public'))

let products = []



io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado al chat')
    socket.emit('messages', messages); // emitir todos los mesajes a lun cliente nuevo

    socket.on('new-message', function(data) {
        messages.push(data)
        io.sockets.emit('messages', messages)
    })


    // console.log('Un cliente se ha conectado')
    // socket.emit('products', products); // emitir todos los mesajes a lun cliente nuevo

    // socket.on('new-product', function(dataProduct) {
    //     products.push(dataProduct)
    //     io.sockets.emit('products', products)
    // })
});


io.on('connection', function(socket) {

    console.log('Un cliente se ha conectado')
    socket.emit('products', products); // emitir todos los mesajes a lun cliente nuevo

    socket.on('new-product', function(dataProduct) {
        products.push(dataProduct)
        io.sockets.emit('products', products)
    })
});


const productos = [{
    "title":"Celular",
    "precio":30000,
    "thumbnail":"fotoCelular.jpg",
    "id":1
},{
    "title":"Computador",
    "precio":50000,
    "thumbnail":"fotoComputador.jpg",
    "id":2
},{
    "title":"Teclado",
    "precio":10000,
    "thumbnail":"fotoTeclado.jpg",
    "id":3
}
]


app.get('/productos', (req,res) => {

    res.render('productos',{productos})
} )


app.post('/productos', (req,res) => {

    productos.push(req.body)
    productos[productos.length-1].id = productos.length

    res.render('productos',{productos: productos})

} )





const PORT = 8080;

const srv = server.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${srv.address().port}`)
} )


srv.on('error', error => console.log(`${error}`) )