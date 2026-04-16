/* Import del enum usado. */
import { Puntuacion } from '../enums/puntuacion';

/* Define la interfaz de una reseña. */
export interface Resena {
  id: string;
  usuario: {
    id: string;
    username: string;
    email?: string;
  };
  pelicula: {
    id: string;
    titulo: string;
    duracion: number;
  };
  puntuacion: Puntuacion;
  comentario: string;
  fecha: string;
}
