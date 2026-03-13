/* Import de la base de datos de mongo. */
import mongoose from 'mongoose'; 

/**
 * Conecta la aplicación a MongoDB usando Mongoose.
 * Si la conexión falla detiene la ejecución del servidor.
 */
export const connectDB = async () => {
    
    /* Se avisará si la conexión es exitosa o no. */
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado');
    
    } catch (error) {
        
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1);
    
    } 
};