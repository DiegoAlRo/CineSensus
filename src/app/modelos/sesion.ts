/* Define la interfaz para un horario. */
export interface Sesion {
  id: string;
  fecha: string; // Formato YYYY-MM-DD 
  sala: string;
  pelicula: string;
  precio: number;
  hora: string; // Formato HHMM

  /* Id de elemento que referenciará. */
  asientosOcupados: {
    fila: number;
    columna: number;
  }[];
}
