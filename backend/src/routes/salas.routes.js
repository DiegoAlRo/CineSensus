/* Imports necesarios. */
import express from 'express'; 
import { obtenerSalas, obtenerSalaPorId, crearSala, actualizarSala, eliminarSala } from '../controllers/salas.controller.js'; 

const router = express.Router(); 

/**
 * GET /salas.
 * Devuelve todas las salas.
 */
router.get('/', obtenerSalas);

router.get('/:id', obtenerSalaPorId);

/**
 * POST /salas
 * Crea una sala.
 */
router.post('/', crearSala);

router.put('/:id', actualizarSala);

router.delete('/:id', eliminarSala);

export default router;