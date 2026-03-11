import express from 'express';
import { obtenerPeliculas } from '../controllers/peliculas.controller.js';

const router = express.Router(); 

/**
 * GET /peliculas
 * Devuelve Todas las películas
 */
router.get('/peliculas', obtenerPeliculas);
export default router;