const mongoose = require('mongoose');

const usuariosCollection = 'usuarios'

const usuariosSchema = new mongoose.Schema({

   
        nombre:{type:String, require:true, max:40},
        clave:{type:String, require:true, max:40},
 



})


const usuariosModel = mongoose.model(usuariosCollection, usuariosSchema)

module.exports = {usuariosModel}