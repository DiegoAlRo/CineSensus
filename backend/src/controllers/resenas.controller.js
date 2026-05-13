/* Imports necesarios. */
import Resena from '../models/Resena.js';
import Pelicula from '../models/Pelicula.js';

/* Método para crear una reseña. */
export const crearResena = async (req, res) => {
    try {
        const { usuario, pelicula, puntuacion, comentario } = req.body;

        const existente = await Resena.findOne({ usuario, pelicula, activo: true });
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
            .populate({
                path: 'usuario'
            })
            .populate({
                path: 'pelicula'
            });

        res.status(201).json(completa);

    } catch (error) {
        res.status(500).json({ error: 'Error al crear reseña' });
    }
};

/* Método para obtener reseñas filtradas por usuario o película. */
export const obtenerResenas = async (req, res) => {
    try {
        const { usuario, pelicula } = req.query;

        const filtro = { activo: true };
        if (usuario) filtro.usuario = usuario;
        if (pelicula) filtro.pelicula = pelicula;

        const resenas = await Resena.find(filtro)
            .populate({
                path: 'usuario'
            })
            .populate({
                path: 'pelicula'
            });

        res.json(resenas);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
};

/* Método para editar una reseña. */
export const editarResena = async (req, res) => {
    try {
        const { puntuacion, comentario } = req.body;

        const resena = await Resena.findById(req.params.id);

        if (!resena || resena.activo === false) {
            return res.status(404).json({ error: 'Reseña no encontrada o inactiva' });
        }

        resena.puntuacion = puntuacion;
        resena.comentario = comentario;
        await resena.save();

        await actualizarPuntuacionMedia(resena.pelicula);

        const completa = await Resena.findById(resena._id)
            .populate({
                path: 'usuario'
            })
            .populate({
                path: 'pelicula'
            });

        res.json(completa);

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

        resena.activo = false;
        await resena.save();

        await actualizarPuntuacionMedia(resena.pelicula);

        res.json({ mensaje: 'Reseña eliminada' });

    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar reseña' });
    }
};

async function actualizarPuntuacionMedia(peliculaId) {
    const pelicula = await Pelicula.findOne({ _id: peliculaId, activo: true });
    if (!pelicula) return;

    const resenas = await Resena.find({ pelicula: peliculaId, activo: true });

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