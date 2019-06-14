const express = require('express');

const Producto = require('../models/producto');

const {verificaToken} = require('../middlewares/autentication');

const app = express();

//buscar todos los productos

app.get('/productos', verificaToken, (req, res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(!productoDB){
            return res.status(500).json({
                ok: false,
                message: 'No se encontraron productos'
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });
});

//buscar producto por id

app.get('/productos/:id', verificaToken, (req,res)=>{
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            if(!productoDB){
                return res.status(400).json({
                    ok:false,
                    messsage: 'No se encuentra producto'
                })
            }
    
            res.json({
                ok:true,
                productoDB
            })
        });       
});

//buscar productos por coincidencias

app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //crea una expresion regular para q la busque coincidencias

    console.log(regex);

    Producto.find({nombre: regex})
    .populate('categoria', 'descripcion')
    .exec((err, productosDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err 
            })
        }

        if(!productosDB){
            return res.status(400).json({
                ok: true,
                messsage: 'No se encontraron productos'
            })
        }

        res.json({
            ok: true,
            productosDB
        });
    });
});

//crear productos

app.post('/productos', verificaToken, (req, res)=>{

    let body = req.body;
    let usuario = req.usuario;

    let producto = new Producto({
        nombre : body.nombre,
        precioUni : body.precio,
        descripcion : body.descripcion,
        disponible : body.disponible,
        categoria : body.categoria,
        usuario : usuario._id,
    });

    producto.save((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            productoDB
        });
    });

});

//editar productos

app.put('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body,{new: true}, (err, productoDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            productoDB
        })
    });
});

//eliminar productos

app.delete('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let elimina = {
        disponible : false
    }

    Producto.findByIdAndUpdate(id, elimina, {new: true}, (err,productoDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                message: 'No se encontro producto'
            });
        }

        res.json({
            ok:true,
            message: 'Producto eliminado con exito'
        });
    });

})





module.exports = app;