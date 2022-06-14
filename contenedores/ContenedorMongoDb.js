const mongoose = require('mongoose');
const { mensajesModel } = require('../models/mensajes');
const util = require('util')
 
const {normalize, denormalize, schema} = require('normalizr')

const authorsSchema = new schema.Entity('author');

const msjSchema = new schema.Entity('mensajes', { author: authorsSchema }, { idAttribute: '_id' });



function print(objeto){
    console.log(util.inspect(objeto, false, 12, true))
}


class ContenedorMongoDb {



    async connect(){
        try{
            const url = 'mongodb+srv://alvi:12qwaszx@cafecluster.agk3g.mongodb.net/ecommerce?retryWrites=true&w=majority'
            let rta = await mongoose.connect(url)
            console.log('base de datos conectada MONGO')
        } catch(err) {
            console.log(err)
        }
    }

    async getAll(){
        try {
            let mensajes = await mensajesModel.find()
            // console.log(mensajes)

          
            return mensajes
            // return JSON.parse(productos)
        } catch (error) {
           
        }
    }

    async getById(req,res){
        try {
            let productos = await productoModel.find({_id: req.params.id})
            // console.log(productos)
            console.log(req);

            res.json(productos)
        } catch (error) {
            res.json(error)
        }
    }


    async postMensaje(data){
        try {
            const mensaje = data
            const mensajeSaveModel = new mensajesModel(mensaje)
            let mensajeSave = await mensajeSaveModel.save()
            console.log(mensajeSave)
         
            
        } catch (error) {
            console.log(error)
        }
    
    }


    async updateProduct (req,res) {
        try {
       
        
      
            let actualizado =  await productoModel.replaceOne({"_id" : req.params.id}, 
              {nombre : req.body.nombre,
              precio : req.body.precio,
          descripcion : req.body.descripcion,
              foto : req.body.foto,
              stock : req.body.stock,
              codigo : req.body.codigo})
              
             res.json(actualizado)
  
      } catch (error) {
          console.log(error)
      }
  

    }


    async delete(req,res) {
        try {
            await productoModel.deleteMany({_id:req.params.id})
            res.json('borrado')
        } catch (error) {
            res.json(error)
        }
    }




}

module.exports = ContenedorMongoDb

