/* Imports necesarios. */
import express from 'express';
import { obtenerPeliculas } from '../controllers/peliculas.controller.js';

const router = express.Router(); 

/**
 * GET /peliculas
 * Devuelve Todas las películas
 */
router.get('/', obtenerPeliculas);
export default router;