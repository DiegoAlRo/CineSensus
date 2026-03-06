import express from 'express'; 
import { obtenerResenas, crearResena } from '../controllers/resenas.controller.js'; 

const router = express.Router(); 

router.get('/', obtenerResenas); 
router.post('/', crearResena); 

export default router;