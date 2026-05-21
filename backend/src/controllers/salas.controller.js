/* imports necesarios. */
import Sala from '../models/Sala.js';

/* Devuelve todas las películas almacenadas en la base de datos. */
export const obtenerSalas = async (req, res) => {
  try {
    const salas = await Sala.find({ activo: true });
    res.json(salas);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener salas', error });
  }
};

/* Devuelve una sala por su ID. */
export const obtenerSalaPorId = async (req, res) => {
  try {

    /* Se busca la sala por su ID y se comprueba que esté activa. */
    const sala = await Sala.findOne({ _id: req.params.id, activo: true });
    if (!sala) {
      return res.status(404).json({ mensaje: 'Sala no encontrada' });
    }
    res.json(sala);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sala', error });
  }
};

/* Este método servirá para crear una sala. */
export const crearSala = async (req, res) => {

  try {
    const nuevaSala = new Sala(req.body);
    await nuevaSala.save();
    res.status(201).json(nuevaSala);

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear sala', error });
  }
};

/* Este método servirá para crear una sala. */
export const actualizarSala = async (req, res) => {
  try {
    const sala = await Sala.findById(req.params.id);

    if (!sala || sala.activo === false) {
      return res.status(404).json({ mensaje: 'Sala no encontrada o inactiva' });
    }

    const salaActualizada = await Sala.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(salaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar sala', error });
  }
};

/* Este método servirá para eliminar una sala. */
export const eliminarSala = async (req, res) => {
  try {
    const sala = await Sala.findById(req.params.id);

    if (!sala || sala.activo === false) {
      return res.status(404).json({ mensaje: 'Sala no encontrada' });
    }

    sala.activo = false;
    await sala.save();

    res.json({ mensaje: 'Sala eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar sala', error });
  }
};