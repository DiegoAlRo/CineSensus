/* Imports necesarios. */
import express from 'express'; 
import { obtenerSalas, obtenerSalaPorId, crearSala, actualizarSala, eliminarSala } from '../controllers/salas.controller.js'; 

/* Se crea un router de Express para manejar las rutas relacionadas con las salas. */
const router = express.Router(); 

/**
 * GET /salas.
 * Devuelve todas las salas.
 */
router.get('/', obtenerSalas);

/**
 * GET /salas/:id.
 * Devuelve una sala por su ID.
 */
router.get('/:id', obtenerSalaPorId);

/**
 * POST /salas
 * Crea una sala.
 */
router.post('/', crearSala);

/**
 * PUT /salas/:id
 * Actualiza los datos de una sala existente según su ID con los datos proporcionados en el cuerpo de la solicitud.
 */
router.put('/:id', actualizarSala);

/** 
 * DELETE /salas/:id
 * Elimina una sala existente según su ID.
 */
router.delete('/:id', eliminarSala);

export default router;