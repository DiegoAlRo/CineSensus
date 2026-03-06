import Resena from '../models/Resena.js'; 

export const obtenerResenas = async (req, res) => { 
    
    try { 

        const resenas = await Resena.find().populate('usuario pelicula'); 
        res.json(resenas); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al obtener reseñas', error }); 
    } 
}; 

export const crearResena = async (req, res) => { 
    
    try { 

        const nuevaResena = new Resena(req.body); 
        await nuevaResena.save(); 
        res.status(201).json(nuevaResena); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al crear reseña', error }); 
    
    } 
};