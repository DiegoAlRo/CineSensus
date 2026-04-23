/* Imports y rutas necesarias para la gestión de usuarios. */
import express from 'express'; 
import { crearUsuario, loginUsuario, obtenerUsuario, actualizarUsuario, cambiarContrasena } from '../controllers/usuarios.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

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
 * PUT /cambiar-contrasena
 * Actualiza la contraseña de un usuario existente.
 */
router.put('/cambiar-contrasena', authMiddleware, cambiarContrasena);

/**
 * GET /:id
 * Obtiene los datos de un usuario por su ID.
 */
router.get('/:id', authMiddleware, obtenerUsuario);

/**
 * PUT /:id
 * Actualiza los datos de un usuario existente.
 */
router.put('/:id', authMiddleware, actualizarUsuario);

export default router;