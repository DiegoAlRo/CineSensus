/* Imports necesarios. */
import Resena from '../models/Resena.js'; 

/* Devuelve todas las reseñas almacenadas en la base de datos. */ 
export const obtenerResenas = async (req, res) => { 
    
    try { 

        const resenas = await Resena.find().populate('usuario pelicula'); 
        res.json(resenas); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al obtener reseñas', error }); 
    } 
}; 

/* Este método servirá para crear una reseña. */
export const crearResena = async (req, res) => { 
    
    try { 

        const nuevaResena = new Resena(req.body); 
        await nuevaResena.save(); 
        res.status(201).json(nuevaResena); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al crear reseña', error }); 
    
    } 
};