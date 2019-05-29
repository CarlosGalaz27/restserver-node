const express = require('express');

const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const _ = require('underscore');


const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/usuario', function (req, res) {
  
  let desde = req.query.desde || 0; // se captura el limite por la url
  desde = Number(desde); // se transforma el dato de la url a numero
  
  let limite = req.query.limite || 0; // se campura el registro inicial por la url
  limite = Number(limite); // se transforma el dato de la url a numero
  
  
  Usuario.find({estado: true}, 'nombre email role google img') //busca en la base de datos mongo
  .limit(limite) //fija limite de registros a mostrar
  .skip(desde)   //muestra desde que registro comienza a mostrar
  .exec((err, usuarios) => { // ejecuta el find mediante callback para posibles errores
	  if(err){
			return res.status(400).json({
				ok: false,
				err
			})
		}
		
		Usuario.count({estado: true}, (err, conteo)=>{ //cuenta el numero de registros encontrados
				res.json({					//en caso de que el find tenga condicion tbm
				ok: true,					//debe ser agregada en el count
				usuarios,
				cuantos: conteo
			})
		})
	  
  })
  
  
})

app.post('/usuario', function (req, res) {
   
  let body = req.body;
  
	let usuario = new Usuario({
		nombre : body.nombre,
		password : bcrypt.hashSync(body.password,10), //encripta pass
		email : body.email,
		role : body.role
	});
	
	usuario.save((err, usuarioDB) => {
		if(err){
			return res.status(400).json({
				ok: false,
				err
			})
		}
		
		res.json({
			ok:true,
			usuario : usuarioDB
		})
		
	})
})

app.put('/usuario/:id', function (req, res) {
  
  let id = req.params.id;
  //captura id desde url
  let body = _.pick(req.body, ['nombre','email','img','role', 'estado']);
  //toma solo los parametros definidos en el arreglo
  
  Usuario.findByIdAndUpdate(id , body, {new: true, runValidators: true}, (err, usuarioDB)=>{
	  //metodo de mongoose busca por id y modifica
	  //(parametro a buscar, elemento que se modifica,opciones para aplicar,callback)
	  
		if(err){
		return res.status(400).json({//devuelve error
				ok: false,
				err
			})
		}
		
		res.json({//devuelve json con los datos modificados gracias a la opcion new
			ok:true,
			usuario: usuarioDB
		})
  })
})

app.delete('/usuario/:id', function (req, res) {
  
	let id = req.params.id;
	let cambiaEstado = {
		estado : false
	}
	
	Usuario.findByIdAndUpdate(id,cambiaEstado,{new : true}, (err, usuarioBorrado)=>{
		if(err){
			return res.status(400).json({
				ok:false,
				err
			})
		}
		
		if(!usuarioBorrado){
			return res.status(400).json({
				ok:false,
				err:"No se encontro registro por id"
			})
		}
		
			
		res.json({
		ok:true,
		estado: usuarioBorrado.estado
		})
		
		
	})	
		
		
	/*Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
		if(err){
			return res.status(400).json({
				ok:false,
				err
			})
		}
		
		if(!usuarioBorrado){
			return res.status(400).json({
				ok:false,
				err:"No se encontro registro por id"
			})
		}
		
		res.json({
			ok:true,
			usuario: usuarioBorrado
		})
	})*/
	
	
  
})

module.exports = app;