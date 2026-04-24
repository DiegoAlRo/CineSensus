/* Imports necesarios. */
import express from 'express'; 
import { obtenerResenas, crearResena, editarResena, eliminarResena } from '../controllers/resenas.controller.js';

const router = express.Router(); 

/**
 * GET /resenas.
 * Devuelve todas las reseñas o filtra por usuario o película si se proporcionan los parámetros de consulta.
 */
router.get('/', obtenerResenas); 

/**
 * POST /resenas.
 * Crea una reseña.
 */
router.post('/', crearResena); 

/**
 * PUT /resenas/:id.
 * Edita una reseña.
 */
router.put('/:id', editarResena); 

/**
 * DELETE /resenas/:id.
 * Elimina una reseña.
 */
router.delete('/:id', eliminarResena); 

export default router;