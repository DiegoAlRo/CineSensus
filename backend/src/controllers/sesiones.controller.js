/* Imports necesarios. */
import Sesion from '../models/Sesion.js'; 

/* Devuelve las sesiones filtradas por película y fecha. */
export const obtenerSesionesPorPeliculaYFecha = async (req, res) => {
    try {
        const { pelicula, fecha } = req.query;

        if (!pelicula || !fecha) {
            return res.status(400).json({ mensaje: "Faltan parámetros: pelicula o fecha" });
        }

        /* Convertimos la fecha a rango del día completo. */
        const inicio = new Date(fecha);
        inicio.setHours(0, 0, 0, 0);

        const fin = new Date(fecha);
        fin.setHours(23, 59, 59, 999);

        const sesiones = await Sesion.find({
            pelicula,
            fecha: { $gte: inicio, $lte: fin }
        }).populate('sala pelicula');

        res.json(sesiones);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener sesiones filtradas', error });
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