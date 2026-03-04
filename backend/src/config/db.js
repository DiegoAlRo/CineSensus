import mongoose from 'mongoose'; 

/**
 * Conecta la aplicación a MongoDB usando Mongoose.
 * Si la conexión falla detiene la ejecución del servidor.
 */
export const connectDB = async () => {
    
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado');
    
    } catch (error) {
        
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    
    } 
};