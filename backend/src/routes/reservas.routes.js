import express from 'express'; 
import { obtenerReservas, crearReserva } from '../controllers/reservas.controller.js'; 

const router = express.Router(); 

router.get('/', obtenerReservas); 
router.post('/', crearReserva); 

export default router;