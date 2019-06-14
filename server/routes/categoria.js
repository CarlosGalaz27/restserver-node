const express = require('express');

const Categoria = require('../models/categorias');
const {verificaToken, validAdminRole} = require('../middlewares/autentication');

const app = express();


app.get('/categoria', verificaToken, (req, res)=>{

    Categoria.find({})
    .populate('usuario', 'nombre email')
    .exec((err, categorias)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok: true,
            categorias
        })
    });
});

app.get('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB)=>{
        if(err){
           return res.status(400).json({
              ok:false,
              err
           })  
        }

        if(!categoriaDB){
            return res.json({
                ok:false,
                message: 'No se encontro la categoria'
            });
        }

        res.json({
            ok:true,
            categoriaDB
        })
    });
});

app.post('/categoria',verificaToken,  (req, res) =>{
    let body = req.body;
    let usuario = req.usuario;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    })

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
               ok:false,
               err
            })  
         }

         res.json({
             ok:true,
             categoriaDB
         })
    })
})

app.put('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body,{new : true},  (err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.json({
                ok: false,
                message: 'No se encontro categoria'
            })
        }

        res.json({
            ok: true,
            categoriaDB
        })
    });
});

app.delete('/categoria/:id', [verificaToken,validAdminRole], (req, res)=>{
    let id = req.params.id;

    Categoria.findByIdAndRemove(id,(err,categoriaDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.json({
                ok: false,
                message: 'No se encontro categoria'
            })
        }

        res.json({
            ok: true,
            message : 'Categoria eliminada con exito',
            categoriaDB
        })
    });
});



module.exports = app;
