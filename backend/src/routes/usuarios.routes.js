import express from 'express'; 
import { obtenerUsuarios, crearUsuario } from '../controllers/usuarios.controller.js'; 

const router = express.Router(); 

// GET /usuarios 
router.get('/', obtenerUsuarios); 

// POST /usuarios 
router.post('/', crearUsuario); 

export default router;