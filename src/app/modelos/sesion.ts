/* Define la interfaz para un horario. */
export interface Sesion {
  id: string;
  fecha: string; // formato YYYY-MM-DD 
  sala: string;
  pelicula: string;
  precio: number;

  /* Id de elemento que referenciará. */
  asientosOcupados: {
    fila: number;
    columna: number;
  }[];
}
