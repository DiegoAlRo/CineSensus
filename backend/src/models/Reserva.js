/* Imports necesarios. */
import mongoose from 'mongoose'; 

/** 
 * Modelo de reserva para CineSensus. 
 * Representa la información básica de una reserva almacenada en MongoDB.
 */
const ReservaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  sesion: { type: mongoose.Schema.Types.ObjectId, ref: 'Sesion', required: true },

  pelicula: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', required: true },
    titulo: String,
    duracion: Number
  },

  fechaReserva: { type: Date, default: Date.now },

  asientos: [
    {
      fila: Number,
      columna: Number
    }
  ],

  total: Number,

  estado: {
    type: String,
    enum: ['pagada'],
    default: 'pagada'
  },

  codigoEntrada: {
    type: String,
    unique: true
  }

}, { timestamps: true });

export default mongoose.model('Reserva', ReservaSchema);