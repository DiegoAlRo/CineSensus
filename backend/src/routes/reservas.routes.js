/* Imports necesarios. */
import express from 'express';
import { crearReserva } from '../controllers/reservas.controller.js';

const router = express.Router();

/**
 * POST /reservas.
 * Crea una reserva.
 */
router.post('/', crearReserva);
  
export default router;