/* Imports necesarios. */
import express from 'express';
import { obtenerPeliculas, obtenerPeliculaPorId } from '../controllers/peliculas.controller.js';

const router = express.Router(); 

/**
 * GET /peliculas.
 * Devuelve Todas las películas.
 */
router.get('/', obtenerPeliculas);

/**
 * GET /peliculas.
 * Devuelve una película por su ID.
 */
router.get('/:id', obtenerPeliculaPorId);

export default router;