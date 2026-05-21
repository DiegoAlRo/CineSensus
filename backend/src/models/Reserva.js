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
    duracion: Number,
    poster: String
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

}, { 
  
  /* Con timestamps se sabrá cuándo se creó o actualizó una reserva. */
  timestamps: true 
});

/* Con este GET obtendremos el ID de una reserva. */
ReservaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

/* Con este método GET obtendremos el ID de una reserva. */
ReservaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

export default mongoose.model('Reserva', ReservaSchema);