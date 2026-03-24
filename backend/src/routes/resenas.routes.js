/* Imports necesarios. */
import express from 'express'; 
import { obtenerResenas, crearResena } from '../controllers/resenas.controller.js'; 

const router = express.Router(); 

/**
 * GET /reseñas.
 * Devuelve todas las reseñas.
 */
router.get('/', obtenerResenas); 

/**
 * POST /resenas.
 * Crea una reseña.
 */
router.post('/', crearResena); 

export default router;