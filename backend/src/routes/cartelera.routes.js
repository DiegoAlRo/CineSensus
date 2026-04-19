/* Imports necesarios para el router de cartelera. */
import express from 'express';
import { obtenerCartelera } from '../controllers/cartelera.controller.js';

/* Se crea un router de Express para manejar las rutas relacionadas con la cartelera. */
const router = express.Router();

/**
 * GET /cartelera
 * Devuelve la lista completa de películas en cartelera para una fecha específica.
 */
router.get('/', obtenerCartelera);

export default router;