/* imports necesarios. */
import express from 'express'; 
import { obtenerSesiones, crearSesion } from '../controllers/sesiones.controller.js'; 

const router = express.Router();
 
/**
 * GET /sesiones.
 * Devuelve todas las sesiones.
 */
router.get('/', obtenerSesiones); 

/**
 * POST /sesiones.
 * Crea una sesión.
 */
router.post('/', crearSesion); 

export default router;