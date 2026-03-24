/* Imports necesarios. */
import express from 'express'; 
import { crearUsuario, loginUsuario, obtenerUsuario, actualizarUsuario } from '../controllers/usuarios.controller.js'; 

const router = express.Router(); 

/**
 * POST /usuarios.
 * Crea un usuario.
 */
router.post('/', crearUsuario); 

router.post('/login', loginUsuario);

/**
 * GET /usuarios.
 * Devuelve un usuario por su id.
 */
router.get('/:id', obtenerUsuario);

router.put('/:id', actualizarUsuario);

export default router;