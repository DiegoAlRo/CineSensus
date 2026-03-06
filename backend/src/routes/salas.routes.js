import express from 'express'; 
import { obtenerSalas, crearSala } from '../controllers/salas.controller.js'; 

const router = express.Router(); 

router.get('/', obtenerSalas); 
router.post('/', crearSala); 

export default router;