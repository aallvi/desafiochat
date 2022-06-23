const express = require('express')
const app = express()
require('dotenv').config()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cors = require('cors');
const { faker } = require('@faker-js/faker');
faker.locale = 'es'

const session = require('express-session')
// Comentar una de las siguientes para probar el funcionamiento de la otra, sqlite y mysql
const routerProductos = express.Router()


const passport = require('passport')
const {Strategy: LocalStrategy} = require('passport-local')

const yargs = require('yargs/yargs')(process.argv.slice(2))

const {puerto} = yargs.
    alias({
        p:'puerto'
    }).
    default({
        puerto:8080
    }).argv

    console.log(puerto)

app.use(session({
    secret:'shhhhhhhhhhhh',
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 6000
    }
}))



app.use(passport.initialize())
app.use(passport.session())
// const {knex} = require('./db/database')

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



app.use(express.static('public'))


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



// app.get('/login/:nombre/:clave', async (req, res) => {

//     let nombre = req.params.nombre
//     let clave = req.params.clave

//     try {
//         let usuario = await usuariosModel.find({nombre: req.params.nombre})
//         // console.log(productos)
//         console.log(req);

//         res.json(usuario)
        
//     } catch (error) {
//         res.json(error)
//     }
     

    

// })

// app.get('/logout', (req, res) => {

//    let nombre =  req.session.usuario

//     req.session.destroy(err => {
//         if (!err) res.send(` ${nombre} estas desconectad@ <a href="http://localhost:8080/" > volver </a> `)
//         else res.send({ status: 'Logout ERROR', body: err })
//     })
// })





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
    }




} ) )
passport.use('login', new LocalStrategy( async (username, password ,done) => {

   

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





app.post('/register', passport.authenticate('register', {failureRedirect:'/failureRegister', successRedirect:'/home'} ) )


app.get('/failureRegister', (req, res) => {

    
    
        res.send('error al registrarse')

  
    
})

app.post('/login', passport.authenticate('login', {failureRedirect:'/failureLogin', successRedirect:'/home'} ) )

app.get('/failureRegister', (req, res) => {

    
    
    res.send('error al iniciar sesion')



})


app.get('/info', (req,res) =>{

    res.send(`
    
    carpeta del proyecto :  ${process.argv[1]}:  </br>
    sistema operativo     : ${process.platform}: </br>
    version node     : ${process.version}: </br>
    memoria total reservada    : ${process.memoryUsage().rss}: </br>
    process id   : ${process.pid}: </br>
    process path   : ${process.cwd()}: </br>
    process args   : ${process.argv}: </br>
               
    
            `)

} )



app.get('/home', (req, res) => {
   
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





// const getProducts = async () =>{
//     try {
//        return  await knex.from('products').select('*')

//        console.log({productos})
            

//     } catch (e) {
//         return e;
//     }
// }

// const insertProducts = async (data) =>{
//     try {
//        const productos =  await knex('products').insert(data)

//        console.log(productos)
            

//     } catch (e) {
//         return e;
//     }
// }


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