/* Define la interfaz de una reserva. */
export interface Reserva {
  id: string;
  usuario: string;
  sesion: string;

  pelicula: {
    id: string;
    titulo: string;
    duracion: number;
  };

  fechaReserva: string;

  asientos: {
    fila: number;
    columna: number;
  }[];

  total: number;

  estado: 'pagada';

  codigoEntrada: string;
}