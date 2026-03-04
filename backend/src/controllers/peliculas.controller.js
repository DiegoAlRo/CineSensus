import Pelicula from '../models/Pelicula.js'; 

/** Devuelve todas las películas almacenadas en la base de datos. */ 
export const obtenerPeliculas = async (req, res) => {
    
    try {
        
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    
    } catch (error) {
        
        res.status(500).json({ mensaje: 'Error al obtener películas' });
    }
};