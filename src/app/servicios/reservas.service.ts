/* Imports necesarios para el servicio. */
import { Injectable } from '@angular/core';
import { Sesion } from '../modelos/sesion';
import { HttpClient } from '@angular/common/http';
import { Reserva } from '../modelos/reserva';

/* Este servicio puede ser inyectado en otros componentes. */
@Injectable({
  providedIn: 'root',
})

/* Servicio para almacenar los datos de la compra. */
export class ReservasService {

  constructor(private http: HttpClient) {}
  
  /* Datos de la reserva. */
  datosCompra: {
    sesion: Sesion;
    asientos: { fila: number; columna: number }[];
    total: number;
  } | null = null;

  reservaActual: Reserva | null = null;

  /* Con este método se crea una reserva en el backend con los datos recibidos. */
  crearReserva(datos: {
    usuarioId: string;
    sesionId: string;
    asientos: { fila: number; columna: number }[];
    total: number;
  }) {
    return this.http.post<Reserva>('http://localhost:3000/reservas', datos);
  }

  /* Método para limpiar los datos de la reserva después de mostrar la compra. */
  limpiarReserva() {
    this.datosCompra = null;
    this.reservaActual = null;
  }
}
