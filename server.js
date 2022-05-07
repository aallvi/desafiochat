const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

// Comentar una de las siguientes para probar el funcionamiento de la otra, sqlite y mysql

// const {knex} = require('./db/database')
const {knex} = require('./db/dbsqlite')




// ------------------------

let messages = []

app.use(express.static('public'))


const mensa = {mensaje:'hola'}

const insertPrueba = async () =>{
    try {
        const mensaje =  await knex('messages').insert(mensa)

       console.log(mensaje)

    //    console.log({productos})
            

    } catch (e) {
        return e;
    }
}

const getMensajes = async () =>{
    try {
       return await knex.from('messages').select('*') 

    //    console.log({productos})
            

    } catch (e) {
        return e;
    }
}

const insertMensajes = async (data) =>{
    try {
       const mensaje =  await knex('messages').insert(data)

       console.log(mensaje)
            

    } catch (e) {
        return e;
    }
}





io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado al chat')
    // socket.emit('messages', messages); // emitir todos los mesajes a lun cliente nuevo

    socket.emit('messages',  await getMensajes())

    console.log(await getMensajes())

    // socket.on('new-message', function(data) {
    //     messages.push(data)
    //     io.sockets.emit('messages', messages)
    // })

    socket.on('new-message',  async (data)=> {
     
        await insertMensajes(data)

        console.log('lo que llega',data)


        socket.emit('messages',  await getMensajes())// emitir todos los mesajes a lun cliente nuevo


    })



});














const getProducts = async () =>{
    try {
       return  await knex.from('products').select('*')

       console.log({productos})
            

    } catch (e) {
        return e;
    }
}

const insertProducts = async (data) =>{
    try {
       const productos =  await knex('products').insert(data)

       console.log(productos)
            

    } catch (e) {
        return e;
    }
}


io.on('connection',  async (socket) => {

    console.log('Un cliente se ha conectado')



    socket.emit('products',  await getProducts())// emitir todos los mesajes a lun cliente nuevo

  

    socket.on('new-product',  async (dataProduct)=> {
     
        await insertProducts(dataProduct)


        socket.emit('products',  await getProducts())// emitir todos los mesajes a lun cliente nuevo



        
        // knex.from('productos').select('*')
        // .then(rows => {
        //     for (row of rows){
        //         products.push({id: `${row['id']}`, nombre:`${row['nombre']}`, precio:`${row['precio']}`})
        //         io.sockets.emit('products', products)

        //     }
        //     console.log(products)
        // io.sockets.emit('products', products)

        // } ).catch(err => {console.log(err); throw err })
        // .finally(() => {
        //     knex.destroy()
        // } )

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