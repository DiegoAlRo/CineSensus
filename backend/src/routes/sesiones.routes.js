/* imports necesarios. */
import express from 'express'; 
import { obtenerSesionesPorPeliculaYFecha, obtenerSesionPorId, crearSesion } from '../controllers/sesiones.controller.js'; 

const router = express.Router();

/**
 * GET /sesiones.
 * Devuelve todas las sesiones filtradas por película y fecha.
 */
router.get('/', obtenerSesionesPorPeliculaYFecha);

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

export default router;