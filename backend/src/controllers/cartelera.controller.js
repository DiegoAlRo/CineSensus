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

    /* Se obtienen todas las sesiones del día */
    const ahora = new Date();

    const sesiones = await Sesion.find({
      fecha: { $gte: inicio, $lte: fin },
      activo: true,
      $expr: {
        $gt: [
          {
            $dateFromString: {
              dateString: {
                $concat: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
                  "T",
                  { $substr: ["$hora", 0, 2] },
                  ":",
                  { $substr: ["$hora", 2, 2] },
                  ":00"
                ]
              },
              timezone: "Europe/Madrid"
            }
          },
          ahora
        ]
      }
    })
    .populate({
      path: 'pelicula',
      match: { activo: true }
    })
    .populate({
      path: 'sala',
      match: { activo: true }
    });

    const sesionesValidas = sesiones.filter(s => s.pelicula && s.sala);

    /* Se agrupan las sesiones por película */
    const sesionesPorPelicula = {};

    sesionesValidas.forEach(s => {
      const id = s.pelicula._id.toString();
      if (!sesionesPorPelicula[id]) sesionesPorPelicula[id] = [];
      sesionesPorPelicula[id].push(s);
    });

    const peliculas = await Pelicula.find({ activo: true });

    /* Insertar sesiones en cada película. */
    peliculas.forEach(p => {
      p.sesiones = sesionesPorPelicula[p.id.toString()] || [];
    });

    const peliculasConSesiones = peliculas.filter(p => p.sesiones.length > 0);

    /* Se devuelve la cartelera con las sesiones correspondientes. */
    res.json(peliculasConSesiones);

  } catch (error) {

    /* En caso de error, se devuelve un mensaje de error. */
    res.status(500).json({ mensaje: 'Error al obtener cartelera', error });
  }
};