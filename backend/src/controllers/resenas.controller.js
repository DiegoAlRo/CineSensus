/* Imports necesarios. */
import Resena from '../models/Resena.js';
import Pelicula from '../models/Pelicula.js';

/* Método para crear una reseña. */
export const crearResena = async (req, res) => {
    try {
        const { usuario, pelicula, puntuacion, comentario } = req.body;

        const existente = await Resena.findOne({ usuario, pelicula });
        if (existente) {
            return res.status(400).json({ error: 'Ya has reseñado esta película' });
        }

        const nueva = await Resena.create({
            usuario,
            pelicula,
            puntuacion,
            comentario
        });

        await actualizarPuntuacionMedia(pelicula);

        const completa = await Resena.findById(nueva._id)
            .populate('usuario')
            .populate('pelicula', '_id titulo duracion');

        const obj = completa.toJSON();
        obj.pelicula = {
            id: completa.pelicula._id.toString(),
            titulo: completa.pelicula.titulo,
            duracion: completa.pelicula.duracion
        };

        res.status(201).json(obj);

    } catch (error) {
        res.status(500).json({ error: 'Error al crear reseña' });
    }
};

/* Método para obtener reseñas filtradas por usuario o película. */
export const obtenerResenas = async (req, res) => {
    try {
        const { usuario, pelicula } = req.query;

        const filtro = {};
        if (usuario) filtro.usuario = usuario;
        if (pelicula) filtro.pelicula = pelicula;

        const resenas = await Resena.find(filtro)
            .populate('usuario')
            .populate('pelicula', '_id titulo duracion');

        const resenasLimpias = resenas.map(r => {
            const obj = r.toJSON();
            obj.pelicula = {
                id: r.pelicula._id.toString(),
                titulo: r.pelicula.titulo,
                duracion: r.pelicula.duracion
            };
            return obj;
        });

        res.json(resenasLimpias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
};

/* Método para editar una reseña. */
export const editarResena = async (req, res) => {
    try {
        const { puntuacion, comentario } = req.body;

        const actualizada = await Resena.findByIdAndUpdate(
            req.params.id,
            { puntuacion, comentario },
            { new: true }
        );

        if (!actualizada) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        // Recalcular puntuación media
        await actualizarPuntuacionMedia(actualizada.pelicula);

        // Devolver reseña completa con populate
        const completa = await Resena.findById(actualizada._id)
            .populate('usuario')
            .populate('pelicula', '_id titulo duracion');

        const obj = completa.toJSON();
        obj.pelicula = {
            id: completa.pelicula._id.toString(),
            titulo: completa.pelicula.titulo,
            duracion: completa.pelicula.duracion
        };

        res.json(obj);

    } catch (error) {
        res.status(500).json({ error: 'Error al editar reseña' });
    }
};

/* Método para eliminar una reseña. */
export const eliminarResena = async (req, res) => {
    try {
        const resena = await Resena.findById(req.params.id);

        if (!resena) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        const peliculaId = resena.pelicula;

        await Resena.findByIdAndDelete(req.params.id);

        // Recalcular puntuación media
        await actualizarPuntuacionMedia(peliculaId);

        res.json({ mensaje: 'Reseña eliminada' });

    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar reseña' });
    }
};

async function actualizarPuntuacionMedia(peliculaId) {
    const resenas = await Resena.find({ pelicula: peliculaId });

    if (resenas.length === 0) {
        await Pelicula.findByIdAndUpdate(peliculaId, { puntuacionMedia: 0 });
        return;
    }

    const suma = resenas.reduce((acc, r) => acc + r.puntuacion, 0);
    const media = suma / resenas.length;

    const mediaRedondeada = Math.round(media * 2) / 2;

    await Pelicula.findByIdAndUpdate(peliculaId, {
        puntuacionMedia: mediaRedondeada
    });
}