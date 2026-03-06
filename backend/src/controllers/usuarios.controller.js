import Usuario from '../models/Usuario.js';

// GET /usuarios 
export const obtenerUsuarios = async (req, res) => {
    
    try {
        
        const usuarios = await Usuario.find();
        res.json(usuarios);
    
    } catch (error) {
        
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
    
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