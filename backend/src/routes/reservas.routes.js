/* Imports necesarios. */
import express from 'express';
import { crearReserva, actualizarEstado, obtenerReservasUsuario } from '../controllers/reservas.controller.js';

const router = express.Router();

/**
 * POST /reservas.
 * Crea una reserva.
 */
router.post('/', crearReserva);

/**
 * PUT /reservas/:id/estado
 * Actualiza el estado de una reserva.
 */
router.put('/:id/estado', actualizarEstado);

/**
 * GET /reservas
 * Obtiene las reservas de un usuario.
 */
router.get('/', obtenerReservasUsuario);
  
export default router;