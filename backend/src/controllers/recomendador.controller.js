import Pelicula from '../models/Pelicula.js';
import Sesion from '../models/Sesion.js';

export const recomendarPelicula = async (req, res) => {
    try {
        const { genero, tono, duracion, edad, puntuacion } = req.body;

        const ahora = new Date();

        let peliculas = await Pelicula.find().lean();

        const sesiones = await Sesion.find({fecha: { $gte: ahora }}).populate('pelicula sala');

        const sesionesPorPelicula = {};

        sesiones.forEach(s => {
        const id = s.pelicula._id.toString();
        if (!sesionesPorPelicula[id]) sesionesPorPelicula[id] = [];
        sesionesPorPelicula[id].push(s);
        });

        peliculas = peliculas
        .map(p => ({
            ...p,
            sesiones: sesionesPorPelicula[p._id.toString()] || []
        })).filter(p => p.sesiones.length > 0);

        if (peliculas.length === 0) {
            return res.json(null);
        }

        const edadToNumber = (valor) => {
            if (!valor) return 99;
            if (valor === "TP") return 0;
            return Number(valor);
        };

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

        peliculas = peliculas.map(p => ({
            ...p,
            score: calcularScore(p)
        }));

        peliculas.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.puntuacionMedia || 0) - (a.puntuacionMedia || 0);
        });

        res.json({
            ...peliculas[0],
            id: peliculas[0]._id.toString()
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el recomendador' });
    }
};