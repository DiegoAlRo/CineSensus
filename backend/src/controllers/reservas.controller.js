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
    console.log(">>> PETICIÓN RECIBIDA EN /reservas");
    console.log("BODY RECIBIDO:", req.body);
    try {
        const { usuarioId, sesionId, asientos, total } = req.body;

    if (!usuarioId || !sesionId || !Array.isArray(asientos) || asientos.length === 0 || !total) {
        console.log(">>> ERROR: Datos incompletos");
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const sesion = await Sesion.findById(sesionId).populate('pelicula');
    console.log(">>> SESIÓN ENCONTRADA:", sesion);
    if (!sesion) {
        console.log(">>> ERROR: Sesión no encontrada");
        return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    const codigoEntrada = crypto.randomUUID();

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
    console.log(">>> RESERVA CREADA:", reserva);

    sesion.asientosOcupados.push(...asientos);
    await sesion.save();

    console.log(">>> RESPUESTA ENVIADA AL FRONT");
    res.status(201).json(reserva);

    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};