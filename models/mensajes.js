const mongoose = require('mongoose');

const mensajesCollection = 'mensajes'

const mensajesSchema = new mongoose.Schema({

    author:{
        id:{type:String, require:true, max:40},
        nombre:{type:String, require:true, max:40},
        apellido:{type:String, require:true, max:40},
        edad:{type:Number, require:true, max:80},
        alias:{type:String, require:true, max:40},
        avatar:{type:String, require:true, max:100}


    },
    mensaje:{type:String, require:true, max:5000}



})



const mensajesModel = mongoose.model(mensajesCollection, mensajesSchema)

module.exports = {mensajesModel}