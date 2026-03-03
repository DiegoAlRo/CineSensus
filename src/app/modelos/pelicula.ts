/* Imports de los enums */
import { Genero } from '../enums/genero';
import { Tono } from '../enums/tono';

/* Define la interfaz para una película. */
export interface Pelicula {
  id: number;
  titulo: string;
  director: string;
  genero: Genero;
  sinopsis: string;
  puntuacionMedia: number;
  entradasVendidas: number;
  tono: Tono;
  duracion: number; // en minutos
  poster: string; // URL a la imagen
  trailer: string; // URL a YouTube

  /* IDs de elementos que referenciará. */
  horarios: number[];
  resenas: number[];
}
