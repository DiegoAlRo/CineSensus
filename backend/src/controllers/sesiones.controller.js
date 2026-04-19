/* Imports necesarios. */
import Sesion from '../models/Sesion.js';

/* Devuelve las sesiones filtradas por película y fecha. */
export const obtenerSesionesPorPeliculaYFecha = async (req, res) => {
    try {

        const { pelicula, fecha } = req.query;

        if (!pelicula || !fecha) {
            return res.status(400).json({ mensaje: "Faltan parámetros: pelicula o fecha" });
        }

        const [year, month, day] = fecha.split('-').map(Number);

        const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
        const fin = new Date(year, month - 1, day, 23, 59, 59, 999);

        const sesiones = await Sesion.find({
        pelicula,
        fecha: { $gte: inicio, $lte: fin }
        }).populate('sala pelicula');

        res.json(sesiones);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener sesiones filtradas', error });
    }
};

/* Devuelve una sesión por su ID. */
export const obtenerSesionPorId = async (req, res) => {
  try {
    const sesion = await Sesion.findById(req.params.id)
      .populate('pelicula sala');

    if (!sesion) {
      return res.status(404).json({ mensaje: 'Sesión no encontrada' });
    }

    res.json(sesion);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sesión', error });
  }
};

/* Cojn este método se creará una sesión. */ 
export const crearSesion = async (req, res) => { 
    
    try { 
        const nuevaSesion = new Sesion(req.body); 
        await nuevaSesion.save(); 
        res.status(201).json(nuevaSesion); 
    
    } catch (error) { 
        res.status(500).json({ mensaje: 'Error al crear sesión', error }); 
    } 
};