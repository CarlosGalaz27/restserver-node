//=====================
//PUERTO
//===================

process.env.PORT = process.env.PORT || 3000;


//=====================
//EXPIRACION TOKENS
//===================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//=====================
//SEED DE TOKENS
//===================

process.env.SEED = process.env.SEED || 'seed-desarrollo';

//=====================
//Entorno
//===================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=====================
//Base de datos
//===================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://carlosG:<danking.123>@cluster0-nodli.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

