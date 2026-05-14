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

        const sesion = await Sesion.findById(sesionId)
            .populate({
                path: 'pelicula'
            })
            .populate({
                path: 'sala'
            });

        if (!sesion || !sesion.pelicula || !sesion.sala) {
            return res.status(404).json({ error: 'Sesión no encontrada' });
        }

        if (!sesion.activo) {
            return res.status(400).json({ error: 'La sesión está inactiva' });
        }

        const fechaSesion = new Date(
            `${sesion.fecha}T${sesion.hora.slice(0, 2)}:${sesion.hora.slice(2, 4)}:00`
        );

        if (fechaSesion < new Date()) {
            return res.status(400).json({ error: 'La sesión ya ha pasado' });
        }

        const ocupados = sesion.asientosOcupados || [];

        const conflicto = asientos.some(a =>
            ocupados.some(o => o.fila === a.fila && o.columna === a.columna)
        );

        if (conflicto) {
            return res.status(409).json({ error: 'Asiento ya ocupado' });
        }

        const totalReal = asientos.length * sesion.precio;
        if (total !== totalReal) {
            return res.status(400).json({ error: 'Total inválido' });
        }

        const codigoEntrada = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

        /* Se crea la reserva con los datos recibidos. */
        const reserva = await Reserva.create({
            usuario: usuarioId,
            sesion: sesionId,
            pelicula: {
                id: sesion.pelicula.id,
                titulo: sesion.pelicula.titulo,
                duracion: sesion.pelicula.duracion,
                poster: sesion.pelicula.poster
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
            .populate({
                path: 'usuario'
            })
            .populate({
                path: 'sesion',
                populate: { path: 'sala' }
            });

        res.json(reservaCompleta);

    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

/* Devuelve todas las reservas almacenadas en la base de datos. */
export const obtenerReservas = async (req, res) => {

    try {

        const reservas = await Reserva.find()
            .populate({
                path: 'usuario'
            })
            .populate({
                path: 'sesion',
                populate: { path: 'sala' }
            });

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
            .populate({
                path: 'usuario'
            })
            .populate({
                path: 'sesion',
                populate: { path: 'sala' }
            });

        res.json(reservas);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reservas del usuario' });
    }
};

export const obtenerReservaPorId = async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id)
            .populate({
                path: 'usuario'
            })
            .populate({
                path: 'sesion',
                populate: { path: 'sala' }
            });

        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        res.json(reserva);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la reserva' });
    }
};

/* Este método actualiza el estado de una reserva. */
export const actualizarEstado = async (req, res) => {
    try {
        const { estado } = req.body;

        const reserva = await Reserva.findById(req.params.id);
        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        const sesion = await Sesion.findById(reserva.sesion);

        if (sesion && sesion.activo === false && estado !== 'cancelada') {
            return res.status(400).json({ error: 'No se puede modificar una reserva de una sesión eliminada' });
        }

        if (estado === 'cancelada' && sesion) {

            sesion.asientosOcupados = sesion.asientosOcupados.filter((a) =>
                !reserva.asientos.some((r) => r.fila === a.fila && r.columna === a.columna)
            );

            await sesion.save();
        }

        if (estado === 'pagada' && sesion) {

            const conflicto = reserva.asientos.some(a =>
                sesion.asientosOcupados.some(o => o.fila === a.fila && o.columna === a.columna)
            );

            if (conflicto) {
                return res.status(409).json({
                    error: 'No se puede volver a marcar como pagada: los asientos ya están ocupados'
                });
            }

            sesion.asientosOcupados.push(...reserva.asientos);
            await sesion.save();
        }

        if (estado === 'consumida' && sesion) {
            sesion.asientosOcupados = sesion.asientosOcupados.filter((a) =>
                !reserva.asientos.some((r) => r.fila === a.fila && r.columna === a.columna)
            );
            await sesion.save();
        }

        reserva.estado = estado;
        await reserva.save();

        res.json(reserva);

    } catch (error) {
        console.error('Error al actualizar estado de la reserva', error);
        res.status(500).json({ error: 'Error al actualizar estado de la reserva' });
    }
};