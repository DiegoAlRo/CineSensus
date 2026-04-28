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

export const crearPelicula = async (req, res) => {
  try {
    const {
      titulo,
      director,
      genero,
      sinopsis,
      tono,
      restriccionEdad,
      duracion,
      poster,
      trailer
    } = req.body;

    const nuevaPelicula = new Pelicula({
      titulo,
      director,
      genero,
      sinopsis,
      tono,
      restriccionEdad,
      duracion,
      poster,
      trailer,
      puntuacionMedia: 0,
      entradasVendidas: 0,
      sesiones: [],
      resenas: []
    });

    await nuevaPelicula.save();
    res.status(201).json(nuevaPelicula);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la película' });
  }
};

export const actualizarPelicula = async (req, res) => {
  try {
    const {
      titulo,
      director,
      genero,
      sinopsis,
      tono,
      restriccionEdad,
      duracion,
      poster,
      trailer
    } = req.body;

    const peliculaActualizada = await Pelicula.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        director,
        genero,
        sinopsis,
        tono,
        restriccionEdad,
        duracion,
        poster,
        trailer
      },
      { new: true }
    );

    if (!peliculaActualizada) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }

    res.json(peliculaActualizada);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la película' });
  }
};

export const eliminarPelicula = async (req, res) => {
  try {
    await Pelicula.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Película eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar película' });
  }
};