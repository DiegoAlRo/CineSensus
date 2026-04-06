/* Imports necesarios para el servicio. */
import { Injectable } from '@angular/core';
import { Sesion } from '../modelos/sesion';

/* Este servicio puede ser inyectado en otros componentes. */
@Injectable({
  providedIn: 'root'
})

/* Servicio para almacenar los datos de la compra. */
export class PagoService {

  datosCompra: {
    sesion: Sesion;
    asientos: { fila: number; col: number }[];
    total: number;
  } | null = null;

}