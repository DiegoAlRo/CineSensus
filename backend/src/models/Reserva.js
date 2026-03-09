import mongoose from 'mongoose'; 

const ReservaSchema = new mongoose.Schema({ 
    
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, 
    sesion: { type: mongoose.Schema.Types.ObjectId, ref: 'Sesion', required: true },  
    fechaReserva: { type: Date, default: Date.now },
    asientos: [
    {
      fila: Number,
      columna: Number
    }
  ],

}, { 
    timestamps: true 
}); 

ReservaSchema.virtual('id').get(function () { return this._id.toHexString(); }); 

ReservaSchema.set('toJSON', { virtuals: true }); export default mongoose.model('Reserva', ReservaSchema);