/* Imports necesarios. */
import Resena from '../models/Resena.js'; 

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

        const resenasLimpias = resenas.map(r => ({
            ...r.toObject(),
            pelicula: {
                id: r.pelicula._id,
                titulo: r.pelicula.titulo,
                duracion: r.pelicula.duracion
            }
        }));

        res.json(resenasLimpias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
};

/* Método para crear una reseña. */
export const crearResena = async (req, res) => {
    try {
        const { usuario, pelicula, puntuacion, comentario } = req.body;

        const nueva = await Resena.create({
            usuario,
            pelicula,
            puntuacion,
            comentario
        });

        res.status(201).json(nueva);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear reseña' });
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

        res.json(actualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar reseña' });
    }
};

/* Método para eliminar una reseña. */
export const eliminarResena = async (req, res) => {
    try {
        await Resena.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Reseña eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar reseña' });
    }
};