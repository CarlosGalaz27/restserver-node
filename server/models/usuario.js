const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let rolValido = { //se crea objeto con valores para validar en rol
	values : ['ADMIN_ROLE','USER_ROLE'], //se ingresan los valores permitidos
	message: '{VALUE} no es un rol valido' //mensaje en caso de error
}


let usuarioSchema = new Schema({ //esquema para definir las caractericticas
	nombre: {					//de los datos a recibir
		type: String,
		required: [true, 'El nombre es necesario']
	},
	password: {
		type: String,
		required: [true, 'El password es necesario']
	},
	email: {
		type: String,
		unique:true,
		required : [true, 'El correo es necesario']
	},
	img: {
		type: String
		
	},
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: rolValido
	},
	estado: {
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	}
})

usuarioSchema.methods.toJSON = function(){
	let user = this;  //el campo user almacena todo lo q envia el schema
	let userObject = user.toObject(); // transforma el user a un objeto
	delete userObject.password; // elimina la propiedad password
	
	return userObject; //retorna el objeto sin la propiedad password
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} ya existe en sistema y debe ser unico'});
//se define los que los valores unique no pueden ser repetidos en la BD
module.exports = mongoose.model('Usuario', usuarioSchema)
