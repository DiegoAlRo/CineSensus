/* Imports y rutas necesarias para la gestión de usuarios. */
import express from 'express'; 
import { crearUsuario, loginUsuario, obtenerUsuario, obtenerUsuarios, actualizarUsuario, cambiarContrasena, eliminarUsuario, reactivarUsuario } from '../controllers/usuarios.controller.js';

/* Se crea un router de Express para manejar las rutas relacionadas con los usuarios. */
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
router.put('/cambiar-contrasena', cambiarContrasena);

/**
 * GET /usuarios
 * Obtiene la lista de todos los usuarios.
 */
router.get('/', obtenerUsuarios);

/**
 * GET /:id
 * Obtiene los datos de un usuario por su ID.
 */
router.get('/:id', obtenerUsuario);

/**
 * PUT /:id
 * Actualiza los datos de un usuario existente.
 */
router.put('/:id', actualizarUsuario);

/**
 * DELETE /:id
 * Elimina un usuario existente por su ID.
 */
router.delete('/:id', eliminarUsuario);

/**
 * PUT /:id/reactivar
 * Reactiva un usuario existente por su ID.
 */
router.put('/:id/reactivar', reactivarUsuario);

export default router;