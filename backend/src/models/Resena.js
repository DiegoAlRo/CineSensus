/* Imports necesatios. */
import mongoose from 'mongoose'; 

/** 
 * Modelo de Reseña para CineSensus. 
 * Representa la información básica de una reseña almacenada en MongoDB.
 */
const ResenaSchema = new mongoose.Schema({
    
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, 
    pelicula: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', required: true }, 
    puntuacion: { type: Number, required: true }, 
    comentario: { type: String }, 
    fecha: { type: Date, default: Date.now } 

}, { 
    timestamps: true 
}); 

ResenaSchema.virtual('id').get(function () { 
    return this._id.toHexString(); 
}); 

ResenaSchema.set('toJSON', { virtuals: true }); 

export default mongoose.model('Resena', ResenaSchema);