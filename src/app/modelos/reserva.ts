/* Define la interfaz de una reserva. */
export interface Reserva {
  id: string;
  usuario: string;
  sesion: string;
  fechaReserva: string; // ISO string
  asientos: {
    fila: number;
    columna: number;
  }[]; // índices de asientos reservados
}
