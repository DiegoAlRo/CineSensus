/* Imports necesarios. */
import Pelicula from '../models/Pelicula.js'; 
import Resena from '../models/Resena.js';

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

    const resenas = await Resena.find({ pelicula: pelicula._id })
    .populate('usuario')
    .populate('pelicula');

    pelicula.resenas = resenas;


    res.json(pelicula);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la película' });
  }
};