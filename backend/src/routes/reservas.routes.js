/* Imports necesarios. */
import express from 'express';
import { crearReserva, actualizarEstado, obtenerReservasUsuario, obtenerReservas, obtenerReservasPorSesion, obtenerReservaPorId } from '../controllers/reservas.controller.js';

/* Se crea un router de Express para manejar las rutas relacionadas con las reservas. */
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

/**
 * GET /reservas/todas
 * Obtiene todas las reservas.
 */
router.get('/todas', obtenerReservas);

/**
 * GET /reservas/sesion
 * Obtiene las reservas de una sesión específica.
 */
router.get('/sesion', obtenerReservasPorSesion);

/**
 * GET /:id
 * Obtiene las reservas de un usuario por el id de estas.
 */
router.get('/:id', obtenerReservaPorId);
  
export default router;