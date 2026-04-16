/* Imports necesarios. */
import Usuario from '../models/Usuario.js';

/* Este método creará y añadirá un usuario a la base de datos. */
export const crearUsuario = async (req, res) => { 
    
  try { 
        
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

    res.json(usuario);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error });
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

/* Este método servirá para actualizar un usuario. */
export const actualizarUsuario = async (req, res) => {
  try {
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
  }

  res.status(500).json({ mensaje: 'Error al actualizar usuario' });
};