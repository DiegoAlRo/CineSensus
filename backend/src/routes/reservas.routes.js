/* Imports necesarios. */
import express from 'express'; 
import { obtenerReservas, crearReserva } from '../controllers/reservas.controller.js'; 

const router = express.Router(); 

/**
 * GET /reservas.
 * Devuelve todas las reservas.
 */
router.get('/', obtenerReservas);

/**
 * POST /reservas.
 * Crea una reserva.
 */
router.post('/', crearReserva); 

export default router;