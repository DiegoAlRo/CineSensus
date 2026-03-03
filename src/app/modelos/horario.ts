/* Define la interfaz para un horario. */
export interface Horario {
  id: number;
  fecha: string; // formato YYYY-MM-DD 
  hora: string; // formato HH:mm
  salaId: number;
  peliculaId: number;

  /* Id de elemento que referenciará. */
  asientosOcupados: number[];
}
