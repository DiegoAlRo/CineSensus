/* Imports necesarios para el servicio. */
import { Injectable } from '@angular/core';
import { Sesion } from '../modelos/sesion';
import { HttpClient } from '@angular/common/http';

/* Este servicio puede ser inyectado en otros componentes. */
@Injectable({
  providedIn: 'root',
})

/* Servicio para almacenar los datos de la compra. */
export class ReservasService {

  constructor(private http: HttpClient) {}
  
  datosCompra: {
    sesion: Sesion;
    asientos: { fila: number; col: number }[];
    total: number;
  } | null = null;

  crearReserva(datos: {
    usuarioId: string;
    sesionId: string;
    asientos: { fila: number; columna: number }[];
    total: number;
  }) {
    debugger
    return this.http.post('http://localhost:3000/reservas', datos);
  }
}
