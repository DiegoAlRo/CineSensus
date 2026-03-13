/* Imports necesarios. */
import express from 'express'; 
import { crearUsuario, loginUsuario } from '../controllers/usuarios.controller.js'; 

const router = express.Router(); 

// POST /usuarios 
router.post('/', crearUsuario); 

router.post('/login', loginUsuario);

export default router;