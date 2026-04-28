/* imports necesarios. */
import Sala from '../models/Sala.js'; 

/* Devuelve todas las películas almacenadas en la base de datos. */ 
export const obtenerSalas = async (req, res) => { 
    try { 
        const salas = await Sala.find(); 
        res.json(salas); 
    
    } catch (error) { 
        res.status(500).json({ mensaje: 'Error al obtener salas', error }); 
    } 
};

export const obtenerSalaPorId = async (req, res) => {
  try {
    const sala = await Sala.findById(req.params.id);
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

export const actualizarSala = async (req, res) => {
  try {
    const salaActualizada = await Sala.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!salaActualizada) {
      return res.status(404).json({ mensaje: 'Sala no encontrada' });
    }

    res.json(salaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar sala', error });
  }
};

export const eliminarSala = async (req, res) => {
  try {
    await Sala.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Sala eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar sala', error });
  }
};