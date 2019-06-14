require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const path = require('path');

const app = express()

app.use(require('./routes/index'));

const bodyParser = require('body-parser');

app.use(express.static(path.resolve(__dirname, '../public')));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


 
mongoose.connect(process.env.URLDB, (err) => {
	if (err) throw err;
	
	console.log('Bases de datos online');
	
});

app.listen(process.env.PORT, ()=> {
	console.log('Escuchando el puerto: ', process.env.PORT);
})