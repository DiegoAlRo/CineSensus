/* Imports necesarios para el controlador de cartelera. */
import Pelicula from '../models/Pelicula.js';
import Sesion from '../models/Sesion.js';

/* Este método obtiene la cartelera de películas para una fecha específica. */
export const obtenerCartelera = async (req, res) => {
  try {

    /* Se obtiene la fecha del query string. */
    const { fecha } = req.query;

    /* Si no se proporciona la fecha, se devuelve un error. */
    if (!fecha) {
      return res.status(400).json({ mensaje: "Falta el parámetro fecha" });
    }

    /* Se parsea la fecha para obtener el inicio y fin del día. */
    const [year, month, day] = fecha.split('-').map(Number);

    /* Se crean objetos Date para el inicio y fin del día. */
    const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
    const fin = new Date(year, month - 1, day, 23, 59, 59, 999);

    /* Se obtienen todas las películas */
    const peliculas = await Pelicula.find();

    /* Se obtienen todas las sesiones del día */
    const sesiones = await Sesion.find({
      fecha: { $gte: inicio, $lte: fin }
    })
    .populate('sala pelicula');

    /* Se agrupan las sesiones por película */
    const sesionesPorPelicula = {};

    sesiones.forEach(s => {
      const id = s.pelicula._id.toString();
      if (!sesionesPorPelicula[id]) sesionesPorPelicula[id] = [];
      sesionesPorPelicula[id].push(s);
    });

    /* Insertar sesiones en cada película. */
    const resultado = peliculas.map(p => ({
      ...p,
      id: p._id,
      sesiones: sesionesPorPelicula[p._id.toString()] || []
    }));

    /* Se devuelve la cartelera con las sesiones correspondientes. */
    res.json(resultado);

  } catch (error) {

    /* En caso de error, se devuelve un mensaje de error. */
    res.status(500).json({ mensaje: 'Error al obtener cartelera', error });
  }
};