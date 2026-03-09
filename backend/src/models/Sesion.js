import mongoose from 'mongoose'; 

const SesionSchema = new mongoose.Schema({ 
    
    pelicula: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', required: true }, 
    sala: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true }, 
    fecha: { type: Date, required: true }, 
    precio: { type: Number, default: 7.5 },

    asientosOcupados: [
    {
      fila: Number,
      columna: Number
    }
    ]

}, { 
    timestamps: true 
}); 

SesionSchema.virtual('id').get(function () { 
    return this._id.toHexString(); 
}); 

SesionSchema.set('toJSON', { virtuals: true }); 

export default mongoose.model('Sesion', SesionSchema);