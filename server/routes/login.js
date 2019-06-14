const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIEN_ID);


const app = express();

app.post('/login', (req, res)=>{

    let body = req.body;

    Usuario.findOne({email : body.email}, (err, usuarioDB)=>{

        if(err){
			return res.status(500).json({
				ok: false,
				err
			})
        }
        
        if(!usuarioDB){
            return res.status(400).json({
				ok: false,
				err : {
                    error: 'El (usuario) o contraseña esta incorrecto'
                }
			})
        }
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err: {
                    error: 'El usuario o (contraseña) esta incorrecto'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });
    })
    
    
});

    async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIEN_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

app.post('/google', async (req, res)=>{
    let token = req.body.idtoken;

    let googleUser = await verify(token)
                            .catch(e=>{
                                return res.status(403).json({
                                    ok: false,
                                    err: e
                                });
                            });

    Usuario.findOne({email : googleUser.email }, (err, usuarioDB) => {
        if(err){ //valida que venga un error
            return res.json({
                ok: false,
                err: e
            });
        }

        if(usuarioDB){
            if(usuarioDB.google === false){ //valida que usuario ya este creado por metodo normal de usuario
                return res.status(400).json({
                    ok:false,
                    err: 'El usuario ya existe y debe autenticarse con credenciales'
                });
            } else {
                let token = jwt.sign({ //si usuario fue creado antes por google renueva token
                    usuario : usuarioDB 
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //en caso de que el usuario no exista

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img; //trae los datos extraidos de google para llenar el schema
            usuario.google = googleUser.google;
            usuario.password = ':)';

            usuario.save((err, usuarioDB)=> { // graba en la base de datos (devuelve un error o el usuario de DB)
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }

                let token = jwt.sign({ //si usuario fue creado antes por google renueva token
                    usuario : usuarioDB 
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
            })

        }
    })                        

})


module.exports = app;