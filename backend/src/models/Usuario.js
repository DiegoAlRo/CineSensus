/* Imports necesario. */
import mongoose from 'mongoose';

/** 
 * Modelo de Usuario para CineSensus. 
 * Representa la información básica de un usuario de la app almacenado en MongoDB.
 */
const UsuarioSchema = new mongoose.Schema({ 
    username: { type: String, required: true, unique: true }, 
    nombre: { type: String, required: true }, 
    apellidos: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
        
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

UsuarioSchema.set('toJSON', { virtuals: true }); 

export default mongoose.model('Usuario', UsuarioSchema);