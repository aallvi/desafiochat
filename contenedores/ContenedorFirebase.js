
// const { productoModel } = require('../models/productos');
const admin = require("firebase-admin");

const serviceAccount = require("./desafiocoder-11b0f-firebase-adminsdk-eklhn-b586411c4b.json");



class ContenedorFirebase {


    async connect() {

        try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
              });
           
              console.log('Base de datos conectada Firebase')
        } catch (error) {
            
        }
    }

    async getAll (){

        const db = admin.firestore()
        const query = db.collection('mensajes')

        const querySnapshot = await query.get()
        let docs =querySnapshot.docs ;
        
        const response = docs.map((doc) => ({
            author: {
               nombre: doc.data().author.nombre
             
            },
           
            mensaje: doc.data().mensaje
        }) )

        console.log(docs.author)
         
       return response

    }

    async getById(req,res) {

        const db = admin.firestore()
        const query = db.collection('productos')
  
            const doc = query.doc(`${req.params.id}`)
            const item = await doc.get()
            const response = item.data()
           
            
            res.json(response)
    
       

    }

    async delete (req,res) {

        try {
            const db = admin.firestore()
            const query = db.collection('productos')
    
    
            const doc = query.doc(`${req.params.id}`)
            const item = await doc.delete()
    
            res.json('producto borrado')
            
        } catch (error) {
            console.log(error)
        }

       



    }

    async postMensaje(data){
        const db = admin.firestore()
        const query = db.collection('mensajes')
        try {
            let id= Date.now()
            let doc = query.doc(`${id}`)
            await doc.create(data)
           console.log(data)
        } catch (error) {
            console.log(error)
        }

    }
   

   async updateProduct(req,res){

    try {
        const db = admin.firestore()
        const query = db.collection('productos')

        const doc = query.doc(`${req.params.id}`)
         let item = await doc.update({nombre : req.body.nombre,
            precio : req.body.precio,
            descripcion : req.body.descripcion,
            foto : req.body.foto,
            stock : req.body.stock,
            codigo : req.body.codigo})

            res.json('actualizado', item)
        
    } catch (error) {


        console.log(error)
        
    }

        

   }




}

module.exports = ContenedorFirebase