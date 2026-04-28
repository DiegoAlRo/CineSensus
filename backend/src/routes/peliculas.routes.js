/* Imports necesarios y rutas relacionadas con la gestión de películas. */
import express from 'express';
import { obtenerPeliculas, obtenerPeliculaPorId, crearPelicula, actualizarPelicula, eliminarPelicula } from '../controllers/peliculas.controller.js';

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

router.post('/', crearPelicula);

router.put('/:id', actualizarPelicula);

router.delete('/:id', eliminarPelicula);

export default router;