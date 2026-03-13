/* Import del enum usado. */
import { Puntuacion } from '../enums/puntuacion';

/* Define la interfaz de una reseña. */
export interface Resena {
  id: string;
  usuario: string;
  pelicula: string;
  puntuacion: Puntuacion;
  comentario: string;
  fecha: string; // ISO string
}
