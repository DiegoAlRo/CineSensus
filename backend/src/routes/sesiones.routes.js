/* imports necesarios. */
import express from 'express'; 
import { obtenerTodasLasSesiones, obtenerSesionesPorPeliculaYFecha, obtenerSesionPorId, crearSesion, actualizarSesion, eliminarSesion } from '../controllers/sesiones.controller.js'; 

/* Se crea un router de Express para manejar las rutas relacionadas con las sesiones. */
const router = express.Router();

/**
 * GET /sesiones.
 * Devuelve todas las sesiones.
 */
router.get('/', obtenerTodasLasSesiones);

/**
 * GET /sesiones.
 * Devuelve todas las sesiones filtradas por película y fecha.
 */
router.get('/filtrar', obtenerSesionesPorPeliculaYFecha);

/**
 * GET /sesiones/:id.
 * Devuelve una sesión por su ID.
 */
router.get('/:id', obtenerSesionPorId);

/**
 * POST /sesiones.
 * Crea una sesión.
 */
router.post('/', crearSesion);

/**
 * PUT /sesiones/:id.
 * Actualiza los datos de una sesión existente según su ID con los datos proporcionados en el cuerpo de la solicitud.
 */
router.put('/:id', actualizarSesion);

/**
 * DELETE /sesiones/:id.
 * Elimina una sesión existente según su ID.
 */
router.delete('/:id', eliminarSesion);

export default router;