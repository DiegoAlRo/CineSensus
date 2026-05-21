/* Imports necesarios. */
import express from 'express';
import { recomendarPelicula } from '../controllers/recomendador.controller.js';

/* Se crea un router de Express para manejar las rutas relacionadas con el recomendador. */
const router = express.Router();

/**
 * POST /recomendador
 * Devuelve una película recomendada basada en las preferencias del usuario proporcionadas en el cuerpo de la solicitud.
 */
router.post('/', recomendarPelicula);

export default router;