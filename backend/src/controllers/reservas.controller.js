/* Imports necesarios. */
import Reserva from '../models/Reserva.js';
import Sesion from '../models/Sesion.js';
import crypto from 'crypto';

/* Devuelve todas las reservas almacenadas en la base de datos. */
export const obtenerReservas = async (req, res) => {
    
    try { 
        
        const reservas = await Reserva.find().populate('usuario sesion'); 
        res.json(reservas); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al obtener reservas', error }); 
    } 
}; 

/* Este método crea una reserva. */ 
export const crearReserva = async (req, res) => {
    try {
        const { usuarioId, sesionId, asientos, total } = req.body;

    if (!usuarioId || !sesionId || !Array.isArray(asientos) || asientos.length === 0 || !total) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const sesion = await Sesion.findById(sesionId).populate('pelicula');
    if (!sesion) {
        return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    const codigoEntrada = crypto.randomUUID();

    /* Se crea la reserva con los datos recibidos. */
    const reserva = await Reserva.create({
        usuario: usuarioId,
        sesion: sesionId,
        pelicula: {
            id: sesion.pelicula._id.toString(),
            titulo: sesion.pelicula.titulo,
            duracion: sesion.pelicula.duracion
        },
        estado: 'pagada',
        asientos,
        total,
        codigoEntrada
    });

    /* Se actualiza la sesión para marcar los asientos como ocupados. */
    sesion.asientosOcupados.push(...asientos);
    await sesion.save();

    let reservaCompleta = await Reserva.findById(reserva._id)
        .populate('usuario')
        .populate({
            path: 'sesion',
            populate: { path: 'sala' }
        })
        .populate({
            path: 'pelicula.id',
            model: 'Pelicula'
        });

    res.status(201).json(reservaCompleta);

    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};