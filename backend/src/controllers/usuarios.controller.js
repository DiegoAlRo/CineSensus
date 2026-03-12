import Usuario from '../models/Usuario.js';

// GET /usuarios 
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

// POST /usuarios
export const crearUsuario = async (req, res) => { 
    
    try { 
        
        const nuevoUsuario = new Usuario(req.body); 
        await nuevoUsuario.save(); 
        res.status(201).json(nuevoUsuario); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al crear usuario', error }); 
    } 
};