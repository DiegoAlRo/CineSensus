/* Imports necesarios. */
import express from 'express';
import { crearReserva, actualizarEstado, obtenerReservasUsuario, obtenerReservaPorId } from '../controllers/reservas.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /reservas.
 * Crea una reserva.
 */
router.post('/', authMiddleware, crearReserva);

/**
 * PUT /reservas/:id/estado
 * Actualiza el estado de una reserva.
 */
router.put('/:id/estado', authMiddleware, actualizarEstado);

/**
 * GET /reservas
 * Obtiene las reservas de un usuario.
 */
router.get('/', authMiddleware, obtenerReservasUsuario);

/**
 * GET /:id
 * Obtiene las reservas de un usuario por el id de estas.
 */
router.get('/:id', authMiddleware, obtenerReservaPorId);
  
export default router;