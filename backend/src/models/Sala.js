/* Imports necesarios. */
import mongoose from 'mongoose'; 

/** 
 * Modelo de Sala para CineSensus. 
 * Representa la información básica de una sala de cine almacenada en MongoDB.
 */
const SalaSchema = new mongoose.Schema({ 

    nombre: { type: String, required: true },
    filas: { type: Number, required: true },
    columnas: { type: Number, required: true }

}, { 
    timestamps: true 
}); 

/* Mediante este método GET obtendremos el ID de una reserva. */
SalaSchema.virtual('id').get(function () { 
    return this._id.toHexString(); 
}); 

SalaSchema.set('toJSON', { virtuals: true }); 

export default mongoose.model('Sala', SalaSchema);