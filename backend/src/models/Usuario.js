/* Import necesario */
import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({ 
    username: { type: String, required: true, unique: true }, 
    nombre: { type: String, required: true }, 
    apellidos: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
        
    historialPeliculas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula' }], 
    historialReservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }], 
    historialResenas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resena' }] 
    
    }, { 
        timestamps: true 
    }); 
    
UsuarioSchema.virtual('id').get(function () { 
    return this._id.toHexString(); 
}); 

UsuarioSchema.set('toJSON', { virtuals: true }); 

export default mongoose.model('Usuario', UsuarioSchema);