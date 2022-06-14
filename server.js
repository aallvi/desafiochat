const express = require('express')
const app = express()
require('dotenv').config()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors');
const { faker } = require('@faker-js/faker');
faker.locale = 'es'
const session = require('express-session')
const MongoStore = require('connect-mongo')
// Comentar una de las siguientes para probar el funcionamiento de la otra, sqlite y mysql
const routerProductos = express.Router()
// const cors = require('cors');

// const {knex} = require('./db/database')
const {knex} = require('./db/dbsqlite')
const ContenedorMongoDb = require('./contenedores/ContenedorMongoDb')
const ContenedorFirebase = require('./contenedores/ContenedorFirebase')

let envVars = process.env.DATABASE
app.use('/api/productos-test', routerProductos)


routerProductos.use(express.json())
routerProductos.use(express.urlencoded({extended:true}))

const conector = envVars === 'FIREBASE' ? new ContenedorFirebase() : envVars === 'MONGO' ? new ContenedorMongoDb() : null

conector.connect()

// ------------------------



app.use(express.static('public'))


app.use(session({
    /* ----------------------------------------------------- */
    /*           Persistencia por redis database             */
    /* ----------------------------------------------------- */
    // Para Mongo Atlas cambiar URL por la del cluster de atlas
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/sesiones' }),
    /* ----------------------------------------------------- */

    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 40000
    } 
}))




let messages = []

const getMensajes = async () =>{
    try {
    //    return await knex.from('messages').select('*') 
     return conector.getAll()
       
            

    } catch (e) {
        return e;
    }
}

const insertMensajes = async (data) =>{
    try {
    //    const mensaje =  await knex('messages').insert(data)

       conector.postMensaje(data)

    //    console.log('data',data)
            

    } catch (e) {
        return e;
    }
}





io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado al chat')
    // socket.emit('messages', messages); // emitir todos los mesajes a lun cliente nuevo

    socket.emit('messages',  await getMensajes())

    // console.log(await getMensajes())

    socket.on('new-message', function(data) {
        messages.push(data)
        io.sockets.emit('messages', messages)
    })

    socket.on('new-message',  async (data)=> {
     
        await insertMensajes(data)

        // console.log('lo que llega',data)


        socket.emit('messages',  await getMensajes())// emitir todos los mesajes a lun cliente nuevo


    })



});

// -----------------------------------DESAFIO LOGIN--------------------------------------------



app.get('/servidor', (req,res) => {
    res.send('servidor ok')
} )

// let contador = 0
// app.get('/sin-session', (req, res) => {
//     res.send({ contador: ++contador })
// })

app.get('/con-session', (req, res) => {
    if (req.session.contador) {
        req.session.contador++
        res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
    }
    else {
        req.session.contador = 1
        res.send('Bienvenido!')
    }
})

app.get('/nombreUsuario',cors(), (req,res) => {
  
    if(req.session.usuario){
        res.json({nombre:req.session.usuario})


    } else {
        res.json('no logeado')
    }

})

// let login = 0

app.get('/login/:nombre', (req, res) => {

    console.log(req.params.nombre)

    

    if (req.session.login) {
      

        res.send(`estas logeado? ${req.session.login}`)
        // res.json('logeado')
        
          
    }
    else {
        req.session.login = true
        req.session.usuario= req.params.nombre
        // res.send(`Bienvenido ${req.params.nombre} , estas logeado`)
        res.send(`Bienvenido ${req.params.nombre} , estas logeado <a href="http://localhost:8080/" > volver </a> `)

        
    }
})

app.get('/logout', (req, res) => {

   let nombre =  req.session.usuario

    req.session.destroy(err => {
        if (!err) res.send(` ${nombre} estas desconectad@ <a href="http://localhost:8080/" > volver </a> `)
        else res.send({ status: 'Logout ERROR', body: err })
    })
})

app.get('/home', (req, res) => {
    if (req.session.login) {
        res.send(`Bienvenido! ${req.session.usuario} ESTAS LOGEADO`)

        console.log('viene')
    } else {
       res.send('no estas logeado')
    }
    
})





// -----------------------------------------------------------------------------


routerProductos.get('/',cors(), async (req,res) => {
    
    let respuesta = [{
        nombre:'',
        precio:faker.commerce.price(100)
    }]

    for (let i = 0; i < 5; i++) {
         respuesta[i]= {
             nombre:faker.commerce.product(),
             precio:faker.commerce.price(100),
             foto:faker.image.imageUrl()

        }
        
    }

    res.json(respuesta)

 

  
} )





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


// io.on('connection',  async (socket) => {

//     console.log('Un cliente se ha conectado')



//     socket.emit('products',  await getProducts())// emitir todos los mesajes a lun cliente nuevo

  

//     socket.on('new-product',  async (dataProduct)=> {
     
//         await insertProducts(dataProduct)


//         socket.emit('products',  await getProducts())// emitir todos los mesajes a lun cliente nuevo



        
//         // knex.from('productos').select('*')
//         // .then(rows => {
//         //     for (row of rows){
//         //         products.push({id: `${row['id']}`, nombre:`${row['nombre']}`, precio:`${row['precio']}`})
//         //         io.sockets.emit('products', products)

//         //     }
//         //     console.log(products)
//         // io.sockets.emit('products', products)

//         // } ).catch(err => {console.log(err); throw err })
//         // .finally(() => {
//         //     knex.destroy()
//         // } )

//     })









// });


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