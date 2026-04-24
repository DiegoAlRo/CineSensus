/* Imports necesarios. */
import mongoose from 'mongoose'; 

/** 
 * Modelo de Sesion para CineSensus. 
 * Representa la información básica de una sesion almacenada en MongoDB.
 */
const SesionSchema = new mongoose.Schema({ 
    
  pelicula: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', required: true }, 
  sala: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true }, 
  fecha: { type: Date, required: true }, 
  precio: { type: Number, default: 7.5 },
  hora: { type: String, required: true }, // Formato HHMM

  asientosOcupados: [
    {
      fila: Number,
      columna: Number
    }
  ]

}, { 
  timestamps: true 
}); 

/* Mediante este método GET obtendremos el ID de una reserva. */
SesionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  }
});

export default mongoose.model('Sesion', SesionSchema);