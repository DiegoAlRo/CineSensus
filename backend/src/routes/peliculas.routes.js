/* Imports necesarios y rutas relacionadas con la gestión de películas. */
import express from 'express';
import { obtenerPeliculas, obtenerPeliculaPorId } from '../controllers/peliculas.controller.js';

const router = express.Router(); 

/**
 * GET /peliculas
 * Devuelve la lista completa de películas disponibles.
 */
router.get('/', obtenerPeliculas);

/**
 * GET /peliculas/:id
 * Devuelve los datos de una película específica según su ID.
 */
router.get('/:id', obtenerPeliculaPorId);

export default router;