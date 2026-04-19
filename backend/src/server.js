/* Imports de las preferencias. */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

/* Crear app */
const app = express();
app.use(cors());
app.use(express.json());

/* Conexión a la base de datos. */
connectDB();

/* Ruta principal. */
app.get('/', (req, res) => {
  res.send('Backend de CineSensus funcionando');
});

/* Rutas. */
import peliculasRoutes from './routes/peliculas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import salasRoutes from './routes/salas.routes.js';
import sesionesRoutes from './routes/sesiones.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import resenasRoutes from './routes/resenas.routes.js';
import carteleraRoutes from './routes/cartelera.routes.js';

/* Rutas del API. */ 
app.use('/peliculas', peliculasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/salas', salasRoutes);
app.use('/sesiones', sesionesRoutes);
app.use('/reservas', reservasRoutes);
app.use('/resenas', resenasRoutes);
app.use('/cartelera', carteleraRoutes);

/* Inicia el Servidor. */
app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en puerto ${process.env.PORT}`);
});