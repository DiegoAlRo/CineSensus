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
    fecha: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true }

}, { 

    /* Con timestamps se sabrá cuándo se creó o actualizó una reseña. */
    timestamps: true 
}); 

/* Con este GET obtendremos el ID de una reseña. */
ResenaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

/* Con este método GET obtendremos el ID de una reseña. */
ResenaSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete ret._id;
    }
});

export default mongoose.model('Resena', ResenaSchema);