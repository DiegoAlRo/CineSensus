/* imports necesarios. */
import express from 'express'; 
import { obtenerSesionesPorPeliculaYFecha, crearSesion } from '../controllers/sesiones.controller.js'; 

const router = express.Router();

/**
 * GET /sesiones.
 * Devuelve todas las sesiones filtradas por película y fecha.
 */
router.get('/', obtenerSesionesPorPeliculaYFecha);

/**
 * POST /sesiones.
 * Crea una sesión.
 */
router.post('/', crearSesion); 

export default router;