/* Imports necesarios. */
import express from 'express'; 
import { crearUsuario, loginUsuario, obtenerUsuario, actualizarUsuario } from '../controllers/usuarios.controller.js'; 

const router = express.Router(); 

// POST /usuarios 
router.post('/', crearUsuario); 

router.post('/login', loginUsuario);

router.get('/:id', obtenerUsuario);

router.put('/:id', actualizarUsuario);

export default router;