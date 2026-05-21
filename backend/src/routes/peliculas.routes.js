/* Imports necesarios y rutas relacionadas con la gestión de películas. */
import express from 'express';
import { obtenerPeliculas, obtenerPeliculaPorId, crearPelicula, actualizarPelicula, eliminarPelicula } from '../controllers/peliculas.controller.js';

/* Se crea un router de Express para manejar las rutas relacionadas con las películas. */
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

/** 
 * POST /peliculas
 * Crea una nueva película con los datos proporcionados en el cuerpo de la solicitud.
 */
router.post('/', crearPelicula);

/**
 * PUT /peliculas/:id
 * Actualiza los datos de una película existente según su ID con los datos proporcionados en el cuerpo de la solicitud.
 */
router.put('/:id', actualizarPelicula);

/** 
 * DELETE /peliculas/:id
 * Elimina una película existente según su ID.
 */
router.delete('/:id', eliminarPelicula);

export default router;