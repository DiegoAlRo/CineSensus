/* Imports necesarios. */
import Reserva from '../models/Reserva.js';
import Sesion from '../models/Sesion.js';
import crypto from 'crypto';
import mongoose from 'mongoose';

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

/* Devuelve todas las reservas almacenadas en la base de datos. */
export const obtenerReservas = async (req, res) => {
    
    try { 
        
        const reservas = await Reserva.find().populate('usuario sesion'); 
        res.json(reservas); 
    
    } catch (error) { 
        
        res.status(500).json({ mensaje: 'Error al obtener reservas', error }); 
    } 
};

/* Devuelve las reservas de un usuario específico. */
export const obtenerReservasUsuario = async (req, res) => {
    try {
        const { usuario } = req.query;

        const reservas = await Reserva.find({
            usuario: new mongoose.Types.ObjectId(usuario)
        })
        .populate('usuario')
        .populate({
            path: 'sesion',
            populate: { path: 'sala' }
        })
        .populate({
            path: 'pelicula.id',
            model: 'Pelicula',
            select: '_id titulo duracion'
        });

        const reservasLimpias = reservas.map(r => {
        const obj = r.toObject();

            return {
                ...obj,
                pelicula: {
                    id: obj.pelicula.id._id,
                    titulo: obj.pelicula.id.titulo,
                    duracion: obj.pelicula.id.duracion
                }
            };
        });

        res.json(reservasLimpias );
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reservas del usuario' });
    }
};

/* Este método actualiza el estado de una reserva. */
export const actualizarEstado = async (req, res) => {
    try {
        const { estado } = req.body;

        const reserva = await Reserva.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        );

        res.json(reserva);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado de la reserva' });
    }
};