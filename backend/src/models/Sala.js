import mongoose from 'mongoose'; 

const SalaSchema = new mongoose.Schema({ 

    nombre: { type: String, required: true }, 
    capacidad: { type: Number, required: true } 

}, { 
    timestamps: true 
}); 

SalaSchema.virtual('id').get(function () { 
    return this._id.toHexString(); 
}); 

SalaSchema.set('toJSON', { virtuals: true }); 

export default mongoose.model('Sala', SalaSchema);