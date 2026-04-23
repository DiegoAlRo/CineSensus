/* Imports necesarios. */
import mongoose from 'mongoose'; 

/** 
 * Modelo de Película para CineSensus. 
 * Representa la información básica de una película almacenada en MongoDB.
 */
const PeliculaSchema = new mongoose.Schema({
    
    titulo: { type: String, required: true },
    director: String,
    genero: String,
    sinopsis: String,
    puntuacionMedia: Number,
    entradasVendidas: Number,
    tono: String,
    restriccionEdad: String,
    duracion: Number,
    poster: String,
    trailer: String,
    resenas: [Number]
});

PeliculaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

PeliculaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

export default mongoose.model('Pelicula', PeliculaSchema);