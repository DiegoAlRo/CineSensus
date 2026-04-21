/* Imports necesario. */
import mongoose from 'mongoose';

/** 
 * Modelo de Usuario para CineSensus. 
 * Representa la información básica de un usuario de la app almacenado en MongoDB.
 */
const UsuarioSchema = new mongoose.Schema({ 
    username: { 
        type: String, required: true, unique: true, trim: true, minlength: 4,
        match: [/^\S+$/, 'El username no puede contener espacios']
    },

    nombre: { 
        type: String, required: true, trim: true,
        match: [/.*\S.*/, 'El nombre no puede estar vacío']
    },

    apellidos: { 
        type: String, required: true, trim: true,
        match: [/.*\S.*/, 'Los apellidos no pueden estar vacíos']
    },
  
    email: { 
        type: String, required: true, unique: true, trim: true, lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },

    password: { 
        type: String, required: true, minlength: 8
    }, 
        
    historialPeliculas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula' }], 
    historialReservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }], 
    historialResenas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resena' }] 
    
}, {
    timestamps: true 
}); 

    
/* Mediante este método GET obtendremos el ID de una reserva. */
UsuarioSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

UsuarioSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete ret._id;
    }
});

export default mongoose.model('Usuario', UsuarioSchema);