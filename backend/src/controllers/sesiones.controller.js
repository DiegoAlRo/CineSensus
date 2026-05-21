/* Imports necesarios. */
import Sesion from '../models/Sesion.js';
import Pelicula from '../models/Pelicula.js';
import Sala from '../models/Sala.js';
import Reserva from '../models/Reserva.js';

/* Devuelve todas las sesiones almacenadas en la base de datos. */
export const obtenerTodasLasSesiones = async (req, res) => {
  try {
    const sesiones = await Sesion.find({ activo: true })
      .populate({
        path: 'pelicula',
        match: { activo: true }
      })
      .populate({
        path: 'sala',
        match: { activo: true }
      });

      const sesionesValidas = sesiones.filter(s => s.pelicula && s.sala);

    res.json(sesionesValidas);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sesiones', error });
  }
};

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
      fecha: { $gte: inicio, $lte: fin },
      activo: true
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

    res.json(sesionesValidas);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sesiones filtradas', error });
  }
};

/* Devuelve una sesión por su ID. */
export const obtenerSesionPorId = async (req, res) => {
  try {
    const sesion = await Sesion.findById(req.params.id)
      .populate({
        path: 'pelicula',
        match: { activo: true }
      })
      .populate({
        path: 'sala',
        match: { activo: true }
      });

    if (!sesion || !sesion.pelicula || !sesion.sala) {
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
    const { pelicula, sala } = req.body;

    const p = await Pelicula.findOne({ _id: pelicula, activo: true });
    const s = await Sala.findOne({ _id: sala, activo: true });

    if (!p) return res.status(400).json({ mensaje: 'Película inactiva' });
    if (!s) return res.status(400).json({ mensaje: 'Sala inactiva' });

    const nuevaSesion = new Sesion(req.body);
    await nuevaSesion.save();
    res.status(201).json(nuevaSesion);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear sesión', error });
  }
};

/* Este método servirá para actualizar una sesión. */
export const actualizarSesion = async (req, res) => {
  try {
    const sesion = await Sesion.findById(req.params.id);

    if (!sesion || sesion.activo === false) {
      return res.status(404).json({ mensaje: 'Sesión no encontrada o inactiva' });
    }

    const reservas = await Reserva.find({
      sesion: req.params.id,
      estado: { $in: ['pagada', 'consumida'] }
    });

    if (reservas.length > 0) {
      return res.status(400).json({ mensaje: 'SESION_CON_RESERVAS' });
    }

    const ahora = new Date();
    const fechaSesion = new Date(
      `${sesion.fecha}T${sesion.hora.slice(0,2)}:${sesion.hora.slice(2,4)}:00`
    );
    
    if (fechaSesion < ahora) {
      return res.status(400).json({ mensaje: 'No se puede editar una sesión pasada' });
    }

    const sesionActualizada = await Sesion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(sesionActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar sesión', error });
  }
};

/* Este método servirá para eliminar una sesión. */
export const eliminarSesion = async (req, res) => {
  try {
    const sesion = await Sesion.findById(req.params.id);

    if (!sesion) {
      return res.status(404).json({ mensaje: 'Sesión no encontrada' });
    }

    sesion.activo = false;
    await sesion.save();

    res.json({ mensaje: 'Sesión eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar sesión', error });
  }
};