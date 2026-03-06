import express from 'express'; 
import { obtenerSesiones, crearSesion } from '../controllers/sesiones.controller.js'; 

const router = express.Router();
 
router.get('/', obtenerSesiones); 
router.post('/', crearSesion); 

export default router;