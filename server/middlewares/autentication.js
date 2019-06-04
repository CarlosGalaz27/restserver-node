
const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next)=>{ 

    let token = req.get('token'); //se obtiene el token enviado desde los headers por el usuario
        jwt.verify(token, process.env.SEED, (err, decoded)=>{ //funcion q obtiene el token, la semilla, y un callback con el err
                                                            //o la informacion el usuario asociado al token
            if(err){
                return res.status(401).json({
                    ok:false, //retorna err
                    err
                })    
            }

            req.usuario = decoded.usuario;
            next(); //permite que la funcion siga ejecutando lo que sigue
        })

}

let validAdminRole = (req, res, next)=>{
    
    let usuarioLogin = req.usuario;

    if(usuarioLogin.role == "ADMIN_ROLE"){    
        next();
    } else {
        return res.json({
            ok:false,
            message: "Rol de usuario no corresponde a administrador"
        });
        
    }
};

module.exports = {
    verificaToken,
    validAdminRole
}