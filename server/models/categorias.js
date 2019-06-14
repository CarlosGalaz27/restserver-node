const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
        descripcion: {
            type: String,
            unique: true,
            require: [true, 'Se necesita una descripcion de la categoria']
        },
        usuario: {
            type: Schema.Types.ObjectId, ref: 'Usuario'
        }
});

module.exports = mongoose.model('Categoria', categoriaSchema);