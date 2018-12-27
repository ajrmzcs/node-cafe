const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']

    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false,
    }, // No es obligatoria
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    }, // Default: 'USER_ROLE' 
    estado: {
        type: Boolean,
        default: true
    }, // Boolean
    google: {
        type: Boolean,
        default: false
    } // Boolean
});

// Modificamos las propiedades del metodo toJSON para eliminar el password del objeto
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
    1
};


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);