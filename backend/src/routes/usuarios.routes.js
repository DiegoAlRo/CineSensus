/* Imports y rutas necesarias para la gestión de usuarios. */
import express from 'express'; 
import { crearUsuario, loginUsuario, obtenerUsuario, actualizarUsuario } from '../controllers/usuarios.controller.js'; 

const router = express.Router(); 

/**
 * POST /usuarios
 * Crea un nuevo usuario en la base de datos.
 */
router.post('/', crearUsuario);

/**
 * POST /usuarios/login
 * Inicia sesión comprobando las credenciales del usuario.
 */
router.post('/login', loginUsuario);

/**
 * GET /usuarios/:id
 * Obtiene los datos de un usuario por su ID.
 */
router.get('/:id', obtenerUsuario);

/**
 * PUT /usuarios/:id
 * Actualiza los datos de un usuario existente.
 */
router.put('/:id', actualizarUsuario);

export default router;