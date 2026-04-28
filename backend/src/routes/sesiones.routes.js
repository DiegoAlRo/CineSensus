/* imports necesarios. */
import express from 'express'; 
import { obtenerTodasLasSesiones, obtenerSesionesPorPeliculaYFecha, obtenerSesionPorId, crearSesion, actualizarSesion, eliminarSesion } from '../controllers/sesiones.controller.js'; 

const router = express.Router();

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

router.put('/:id', actualizarSesion);

router.delete('/:id', eliminarSesion);

export default router;