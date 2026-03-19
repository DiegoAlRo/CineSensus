/* Imports necesarios. */
import Pelicula from '../models/Pelicula.js'; 

/* Devuelve todas las películas almacenadas en la base de datos. */ 
export const obtenerPeliculas = async (req, res) => {
    
    try {
        
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    
    } catch (error) {
        
        res.status(500).json({ mensaje: 'Error al obtener películas' });
    }
};

/* Este método podrá obtener una película por su ID. */
export const obtenerPeliculaPorId = async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);

    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }

    res.json(pelicula);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la película' });
  }
};