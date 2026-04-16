/* Imports de modelos para el modelo. */
import { Pelicula } from "./pelicula";
import { Sala } from "./sala";

/* Define la interfaz para un horario. */
export interface Sesion {
  _id: string;
  id?: string; // Id de elemento que referenciará
  fecha: string; // Date real
  sala: Sala; // Objeto Sala
  pelicula: Pelicula; // Objeto Pelicula
  precio: number;
  hora: string; // Formato HHMM

  /* Id de elemento que referenciará. */
  asientosOcupados: {
    fila: number;
    columna: number;
  }[];
}
