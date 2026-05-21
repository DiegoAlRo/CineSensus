/* Imports necesarios. */
import Pelicula from '../models/Pelicula.js';
import Resena from '../models/Resena.js';

/* Devuelve todas las películas almacenadas en la base de datos. */
export const obtenerPeliculas = async (req, res) => {

  try {

    const peliculas = await Pelicula.find({ activo: true });
    res.json(peliculas);

  } catch (error) {

    res.status(500).json({ mensaje: 'Error al obtener películas' });
  }
};

/* Este método podrá obtener una película por su ID. */
export const obtenerPeliculaPorId = async (req, res) => {
  try {
    const pelicula = await Pelicula.findOne({ _id: req.params.id, activo: true });

    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }

    /* Se obtienen las reseñas de la película y se añaden al objeto película. */
    const resenas = await Resena.find({ pelicula: pelicula._id, activo: true })
      .populate('usuario')
      .populate({
        path: 'pelicula',
        match: { activo: true }
      })
    pelicula.resenas = resenas;


    res.json(pelicula);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la película' });
  }
};

/* Devuelve las películas filtradas por género o director. */
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

/* Método para actualizar una película. */
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

    /* Se verifica que la película exista y esté activa. */
    const pelicula = await Pelicula.findById(req.params.id);
    if (!pelicula || pelicula.activo === false) {
      return res.status(404).json({ mensaje: 'Película no encontrada o inactiva' });
    }

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

/* Método para eliminar una película. */
export const eliminarPelicula = async (req, res) => {
  try {
    /* Se verifica que la película exista. */
    await Pelicula.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ mensaje: 'Película eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar película' });
  }
};