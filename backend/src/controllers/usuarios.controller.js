/* Imports necesarios. */
import Usuario from '../models/Usuario.js';
import jwt from 'jsonwebtoken';

/* Este método creará y añadirá un usuario a la base de datos. */
export const crearUsuario = async (req, res) => { 
    
  try {

    /* Aseguramos el correcto registro. */
    if (req.body.nombre) req.body.nombre = req.body.nombre.trim();
    if (req.body.apellidos) req.body.apellidos = req.body.apellidos.trim();
    if (req.body.username) req.body.username = req.body.username.trim();
    if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
        
    const nuevoUsuario = new Usuario(req.body); 
    await nuevoUsuario.save(); 
    res.status(201).json(nuevoUsuario); 
    
  } catch (error) { 
        
    /* Si el error es por un email duplicado, se devuelve un mensaje para ser mostrado por el errores.service. */
    if (error.code === 11000) {

      /* Email duplicado. */
      if (error.keyPattern?.email || error.keyValue?.email) {
        return res.status(400).json({ mensaje: 'EMAIL_DUPLICADO' });
      }

      /* Nombre de usuario duplicado. */
      if (error.keyPattern?.username || error.keyValue?.username) {
        return res.status(400).json({ mensaje: 'USERNAME_DUPLICADO' });
      }
    }

    console.error('ERROR AL CREAR USUARIO:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  } 
};

/* Este método comprobará coincidencias en la base de datos e identificará al usuario. */ 
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '7d' }
    );

    res.json({
      usuario,
      token
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
};

/* Obtener un usuario por su ID. */
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error });
  }
};

export const cambiarContrasena = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { contrasenaActual, nuevaContrasena } = req.body;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'USUARIO_NO_ENCONTRADO' });
    }

    const coincide = usuario.password === contrasenaActual;
    if (!coincide) {
      return res.status(400).json({ mensaje: 'CONTRASENA_INCORRECTA' });
    }

    usuario.password = nuevaContrasena;
    await usuario.save();

    res.json({ mensaje: 'OK' });

  } catch (error) {
    res.status(500).json({ mensaje: 'ERROR_SERVIDOR' });
  }
};

/* Este método servirá para actualizar un usuario. */
export const actualizarUsuario = async (req, res) => {
  try {

    /* Nos aseguraremos que de que el usuario se actualice sin fallos. */
    if (req.body.nombre) req.body.nombre = req.body.nombre.trim();
    if (req.body.apellidos) req.body.apellidos = req.body.apellidos.trim();
    if (req.body.username) req.body.username = req.body.username.trim();
    if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(usuarioActualizado);

  } catch (error) {

    /* Si el error es por un email o username duplicado, se devuelve un mensaje para ser mostrado por el errores.service. */
    if (error.code === 11000) {

      /* Email duplicado. */
      if (error.keyPattern?.email || error.keyValue?.email) {
        return res.status(400).json({ mensaje: 'EMAIL_DUPLICADO' });
      }

      /* Nombre de usuario duplicado. */
      if (error.keyPattern?.username || error.keyValue?.username) {
        return res.status(400).json({ mensaje: 'USERNAME_DUPLICADO' });
      }
    }

    console.error('ERROR AL ACTUALIZAR USUARIO:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }

};