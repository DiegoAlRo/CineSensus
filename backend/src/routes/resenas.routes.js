/* Imports necesarios. */
import express from 'express'; 
import { obtenerResenas, crearResena } from '../controllers/resenas.controller.js'; 

const router = express.Router(); 

/**
 * GET /reseñas
 * Devuelve Todas las reseñas
 */
router.get('/', obtenerResenas); 

/**
 * POST /peliculas
 * 
 */
router.post('/', crearResena); 

export default router;