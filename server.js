const express = require('express')
const app = express()
require('dotenv').config()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors');
const { faker } = require('@faker-js/faker');
faker.locale = 'es'

const clusterOn = require('cluster')
const log4js= require("log4js")

const numCpus = require('os').cpus().length

const session = require('express-session')
// Comentar una de las siguientes para probar el funcionamiento de la otra, sqlite y mysql
const routerProductos = express.Router()
const compression = require('compression')


const passport = require('passport')
const {Strategy: LocalStrategy} = require('passport-local')

const yargs = require('yargs/yargs')(process.argv.slice(2))

const {puerto,cluster} = yargs.
    alias({
        p:'puerto',
        c:'cluster'
    }).
    default({
        puerto:8081,
        cluster:false
    }).argv

    console.log(cluster)

app.use(session({
    secret:'shhhhhhhhhhhh',
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 6000
    }
}))

// console.log(yargs.c)

// LOGER ===================================================================

log4js.configure({

  appenders:{
   consola:{type:'console'},
   archivoErrores: {type:'file', filename: 'error.log'},
   archivoWarn:{type:'file', filename: 'warn.log'},
   loggerConsola: {type:'logLevelFilter', appender:'consola', level:'info'},
   loggerArchivoErrores:{type:'logLevelFilter', appender:'archivoErrores', level:'error'},
   loggerArchivoWarn:{type:'logLevelFilter', appender:'archivoWarn', level:'warn'},

  },
  categories:{
    default:{
        appenders: ['loggerConsola','loggerArchivoErrores','loggerArchivoWarn'], level:'all'
    }
  }


})

module.exports = logger = log4js.getLogger();














app.use(passport.initialize())
app.use(passport.session())
// const {knex} = require('./db/database')

if(cluster && clusterOn.isMaster){
    console.log('cluster')
    console.log(numCpus)
    console.log(`PID MASTER ${process.pid} `)

       for (let i = 0; i < numCpus; i++) {
        clusterOn.fork()
        
       }

       clusterOn.on('exit',worker => {
        console.log('worker', worker.process.pid,'died', new Date().toLocaleString())
        clusterOn.fork()
       })
}else {
    console.log('fork')

    const PORT = parseInt(process.argv[2]) || 8085

    app.get('/fork' , (req,res) => {
        res.send(`servidor express en ${PORT} - PID ${process.pid}  `)
    } )

    app.listen(PORT , err => {
        if(!err) console.log(`servidor express en ${PORT} - PID ${process.pid}  `)
    })


}



const ContenedorMongoDb = require('./contenedores/ContenedorMongoDb')
const ContenedorFirebase = require('./contenedores/ContenedorFirebase')

let envVars = process.env.DATABASE
app.use('/api/productos-test', routerProductos)

const { usuariosModel } = require('./models/usuarios');
// const { clearGlobalAppDefaultCred } = require('firebase-admin/lib/app/credential-factory')


routerProductos.use(express.json())
routerProductos.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const conector = envVars === 'FIREBASE' ? new ContenedorFirebase() : envVars === 'MONGO' ? new ContenedorMongoDb() : null

conector.connect()

// ------------------------



// app.use(express.static('public'))


// app.use(session({
//     /* ----------------------------------------------------- */
//     /*           Persistencia por redis database             */
//     /* ----------------------------------------------------- */
//     // Para Mongo Atlas cambiar URL por la del cluster de atlas
//     store: MongoStore.create({ mongoUrl: 'mongodb://localhost/sesiones' }),
//     /* ----------------------------------------------------- */

//     secret: 'shhhhhhhhhhhhhhhhhhhhh',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 40000
//     } 
// }))




// io.on('connection', async (socket) => {
//     console.log('Un cliente se ha conectado al chat')
//     // socket.emit('messages', messages); // emitir todos los mesajes a lun cliente nuevo

//     socket.emit('messages',  await getMensajes())

//     // console.log(await getMensajes())

//     socket.on('new-message', function(data) {
//         messages.push(data)
//         io.sockets.emit('messages', messages)
//     })

//     socket.on('new-message',  async (data)=> {
     
//         await insertMensajes(data)

//         // console.log('lo que llega',data)


//         socket.emit('messages',  await getMensajes())// emitir todos los mesajes a lun cliente nuevo


//     })



// });

// -----------------------------------DESAFIO LOGIN--------------------------------------------



app.get('/login/:nombre/:clave', async (req, res) => {

    let nombre = req.params.nombre
    let clave = req.params.clave

    try {
        let usuario = await usuariosModel.find({nombre: req.params.nombre})
        // console.log(productos)
        console.log(req);

        res.json(usuario)
        
    } catch (error) {
        res.json(error)
        logger.error(error)
    }
     

    

})

app.get('/logout', (req, res) => {

   let nombre =  req.session.usuario

    req.session.destroy(err => {
        if (!err) res.send(` ${nombre} estas desconectad@ <a href="http://localhost:8080/" > volver </a> `)
        else res.send({ status: 'Logout ERROR', body: err })
    })
})





// app.post('/register/:nombre/:clave', async(req, res) => {
     
//     let nombre = req.params.nombre
//     let clave = req.params.clave
     
//     console.log(nombre,clave)

   
//         try {
//             const usuario = {nombre:req.params.nombre,
//                              clave:req.params.clave}
//             const usuariosSaveModel = new usuariosModel(usuario)
//             let usuariosSave = await usuariosSaveModel.save()
//             console.log(usuariosSave)
         
            
//         } catch (error) {
//             console.log(error)
//         }
    
    

//     res.json({nombre:nombre})


    




// passport.use('registrrr', new LocalStrategy({
//     passReqToCallback:true
// },   (req, username, password ,done) => {

//     console.log(username)

//     const {direccion} = req.body

//      const usuario = usuarios.find(usuario => usuario.username == username )

   

     
//      const user = {
//         username,
//         password,
//         direccion
//      }

//      usuarios.push(user)

//      console.log(usuarios)


//      return done(null, user)

     



// } ) )

app.get('*' , (req,res) => {
    const {url, method} = req
    logger.warn(`ruta ${method} ${url} no existe `)

    logger.info(`ruta ${method} ${url} `)
    res.send(`ruta ${method} ${url} no existe `)
} )


    
// })
passport.use('register', new LocalStrategy({
    passReqToCallback:true
},  async (req, username, password ,done) => {

   

     const usuario = await usuariosModel.findOne({ 'nombre': username })

     console.log('ola',usuario)

     if(usuario){
        console.log('registrado')
        return done('already registered')
     }

     try {
        const usuario = {nombre:username,
                         clave:password}
        const usuariosSaveModel = new usuariosModel(usuario)
        let usuariosSave = await usuariosSaveModel.save()
        console.log('esta',usuariosSave)


     return done(null, usuario)

        
    } catch (error) {
        console.log(error)
        logger.error(error)

    }




} ) )
passport.use('login', new LocalStrategy( async (username, password ,done) => {

    const {url, method} = req
    logger.info(`ruta ${method} ${url} `)

     const usuario = await usuariosModel.findOne({ 'nombre': username })

   

     if(!usuario){
        console.log('no existe usuario')
        return done(null,false)
     }
     
     if(usuario.clave != password ){
       return done(null,false)

     }


     return done(null, usuario)




} ) )

// const PORT = parseInt(process.argv[2]) || 8080


app.get('/api/random', (req, res) => {

    const {url, method} = req
    logger.info(`ruta ${method} ${url} `)
    
    res.send(` corriendo nginx ${PORT}`)



})



app.post('/register', passport.authenticate('register', {failureRedirect:'/failureRegister', successRedirect:'/home'} ) )


app.get('/failureRegister', (req, res) => {

    const {url, method} = req
    logger.info(`ruta ${method} ${url} `)
    
        res.send('error al registrarse')

  
    
})

app.post('/login', passport.authenticate('login', {failureRedirect:'/failureLogin', successRedirect:'/home'} ) )

app.get('/failureRegister', (req, res) => {
    
    const {url, method} = req
    logger.info(`ruta ${method} ${url} `)
    

    
    
    res.send('error al iniciar sesion')

    logger.error('error al iniciar sesion')

})


app.get('/info', compression(), (req,res) =>{

    res.send(`
    
    carpeta del proyecto :  ${process.argv[1]}:  </br>
    sistema operativo     : ${process.platform}: </br>
    version node     : ${process.version}: </br>
    memoria total reservada    : ${process.memoryUsage().rss}: </br>
    process id   : ${process.pid}: </br>
    process path   : ${process.cwd()}: </br>
    process args   : ${process.argv}: </br>
    numero procesos : ${numCpus}</br>
    
            `)

} )



app.get('/home', (req, res) => {
    const {url, method} = req
    logger.info(`ruta ${method} ${url} `)
   
        res.send(`Bienvenido! ${req.session.passport.user.nombre} ESTAS LOGEADO`)

        console.log('ESTO',req.session.passport.user.nombre)
   

    
})


passport.serializeUser(function(user,done){
    done(null, user)
})

passport.deserializeUser(function(username,done){
    const usuario = usuariosModel.findOne({'nombre':username})
    done(null, usuario)
})



// -----------------------------------------------------------------------------


// routerProductos.get('/',cors(), async (req,res) => {
    
//     let respuesta = [{
//         nombre:'',
//         precio:faker.commerce.price(100)
//     }]

//     for (let i = 0; i < 5; i++) {
//          respuesta[i]= {
//              nombre:faker.commerce.product(),
//              precio:faker.commerce.price(100),
//              foto:faker.image.imageUrl()

//         }
        
//     }

//     res.json(respuesta)

 

  
// } )







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


// const productos = [{
//     "title":"Celular",
//     "precio":30000,
//     "thumbnail":"fotoCelular.jpg",
//     "id":1
// },{
//     "title":"Computador",
//     "precio":50000,
//     "thumbnail":"fotoComputador.jpg",
//     "id":2
// },{
//     "title":"Teclado",
//     "precio":10000,
//     "thumbnail":"fotoTeclado.jpg",
//     "id":3
// }
// ]


// app.get('/productos', (req,res) => {

//     res.render('productos',{productos})
// } )


// app.post('/productos', (req,res) => {

//     productos.push(req.body)
//     productos[productos.length-1].id = productos.length

//     res.render('productos',{productos: productos})

// } )





const PORT = puerto;

const srv = server.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${srv.address().port}`)
} )


srv.on('error', error => console.log(`${error}`) )