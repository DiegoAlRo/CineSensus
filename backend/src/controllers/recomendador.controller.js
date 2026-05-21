/* Imports necesarios. */
import Pelicula from '../models/Pelicula.js';
import Sesion from '../models/Sesion.js';

/* Método para recomendar una película según las preferencias del usuario. */
export const recomendarPelicula = async (req, res) => {
    try {

        /* Se reciben las preferencias del usuario a través del body. */
        const { genero, tono, duracion, edad, puntuacion } = req.body;

        /* Se obtiene la fecha actual para filtrar las sesiones futuras. */
        const ahora = new Date();
        ahora.setHours(0, 0, 0, 0);

        let peliculas = await Pelicula.find({ activo: true }).lean();

        /* Se obtienen las sesiones futuras y se agrupan por película. */
        const sesiones = await Sesion.find({ fecha: { $gte: ahora }, activo: true })
            .populate({
                path: 'pelicula',
                match: { activo: true }
            })
            .populate({
                path: 'sala',
                match: { activo: true }
            });

            /* Se filtran las sesiones que no tienen película o sala activa. */
        const sesionesValidas = sesiones.filter(s => s.pelicula && s.sala);

        const sesionesPorPelicula = {};

        /* Se agrupan las sesiones por película. */
        sesionesValidas.forEach(s => {
            const id = s.pelicula._id.toString();
            if (!sesionesPorPelicula[id]) sesionesPorPelicula[id] = [];
            sesionesPorPelicula[id].push(s);
        });

        /* Se asignan las sesiones a cada película y se filtran las que no tienen sesiones futuras. */
        peliculas = peliculas
        .map(p => ({
            ...p,
            sesiones: sesionesPorPelicula[p._id.toString()] || []
        })).filter(p => p.sesiones.length > 0);

        /* Si no hay películas con sesiones futuras, se devuelve null. */
        if (peliculas.length === 0) {
            return res.json(null);
        }

        /* Función para convertir la restricción de edad a un número. */
        const edadToNumber = (valor) => {
            if (!valor) return 99;
            if (valor === "TP") return 0;
            return Number(valor);
        };

        /* Función para calcular el score de cada película según las preferencias del usuario. */
        const calcularScore = (p) => {
            let score = 0;

            if (genero && p.genero === genero) score += 3;

            if (tono && p.tono === tono) score += 2;

            if (duracion) {
                if (duracion === 'Menos de 90 min' && p.duracion < 90) score++;
                if (duracion === 'Entre 90 - 120 min' && p.duracion >= 90 && p.duracion <= 120) score++;
                if (duracion === 'Más de 120 min' && p.duracion > 120) score++;
            }

            if (edad !== null && edad !== undefined) {
                const edadPelicula = edadToNumber(p.restriccionEdad);
                if (edadPelicula <= edad) score++;
            }

            if (puntuacion && p.puntuacionMedia >= puntuacion) score++;

            return score;
        };

        /* Se calcula el score de cada película y se ordenan por score y puntuación media. */
        peliculas = peliculas.map(p => ({
            ...p,
            score: calcularScore(p)
        }));

        /* Se ordenan las películas por score y puntuación media. */
        peliculas.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.puntuacionMedia || 0) - (a.puntuacionMedia || 0);
        });

        /* Se devuelve la película con el mejor score. */
        res.json({
            ...peliculas[0],
            id: peliculas[0]._id.toString()
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el recomendador' });
    }
};