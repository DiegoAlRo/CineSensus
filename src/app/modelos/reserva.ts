/* Define la interfaz de una reserva. */
export interface Reserva {
  id: number;
  usuarioId: number;
  peliculaId: number;
  horarioId: number;
  asientos: number[]; // índices de asientos reservados 
  fechaCompra: string; // ISO string
}
