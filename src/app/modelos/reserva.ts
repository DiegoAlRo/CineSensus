/* Imports de modelos para formar una reserva. */
import { Usuario } from './usuario';
import { Sesion } from './sesion';

/* Esta interfaz define la estructura de una reserva. */
export interface Reserva {
  id: string;
  usuario: Usuario;
  sesion: Sesion;
  pelicula: {
    id: string;
    titulo: string;
    duracion: number;
  };
  fechaReserva: string;
  asientos: { fila: number; columna: number }[];
  total: number;
  estado: 'pagada' | 'consumida' | 'cancelada';
  codigoEntrada: string;
}
