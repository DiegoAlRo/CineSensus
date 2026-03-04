/* Imports de las preferencias. */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import peliculasRotes from './routes/peliculas.routes.js';

/* Variables de .env. */
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* Conecxión a la base de datos. */
connectDB();

app.use('/peliculas', peliculasRotes);

/* Ruta. */
app.get('/', (req, res) => {
  res.send('Backend de CineSensus funcionando');
});

/* Inicia el Servidor */
app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en puerto ${process.env.PORT}`);
});