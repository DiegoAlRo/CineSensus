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
    id: String,
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
    enum: ['pagada', 'consumida', 'cancelada'],
    default: 'pagada'
  },

  codigoEntrada: {
    type: String,
    unique: true
  }

}, { timestamps: true });

ReservaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ReservaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

export default mongoose.model('Reserva', ReservaSchema);