//=====================
//PUERTO
//===================

process.env.PORT = process.env.PORT || 3000;


//=====================
//EXPIRACION TOKENS
//===================

process.env.CADUCIDAD_TOKEN = '48h';
//=====================
//SEED DE TOKENS
//===================

process.env.SEED = process.env.SEED || 'seed-desarrollo';

//=====================
//Entorno
//===================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
//Cliente de google
//===================

process.env.CLIEN_ID = process.env.CLIEN_ID || '1001042711083-c2tjapth8fq5f8hl19biej0d35gel56c.apps.googleusercontent.com'


//=====================
//Base de datos
//===================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

