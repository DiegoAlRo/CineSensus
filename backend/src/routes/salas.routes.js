/* Imports necesarios. */
import express from 'express'; 
import { obtenerSalas, crearSala } from '../controllers/salas.controller.js'; 

const router = express.Router(); 

/**
 * GET /salas.
 * Devuelve todas las salas.
 */
router.get('/', obtenerSalas);

/**
 * POST /salas
 * Crea una sala.
 */
router.post('/', crearSala); 

export default router;