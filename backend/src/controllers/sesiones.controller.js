/* Imports necesarios. */
import Sesion from '../models/Sesion.js'; 

export const obtenerSesiones = async (req, res) => { 
    
    try { 
        const sesiones = await Sesion.find().populate('pelicula sala'); 
        res.json(sesiones); 
    
    } catch (error) { 
        res.status(500).json({ mensaje: 'Error al obtener sesiones', error }); 
    } 
}; 

export const crearSesion = async (req, res) => { 
    
    try { 
        const nuevaSesion = new Sesion(req.body); 
        await nuevaSesion.save(); 
        res.status(201).json(nuevaSesion); 
    
    } catch (error) { 
        res.status(500).json({ mensaje: 'Error al crear sesión', error }); 
    } 
};