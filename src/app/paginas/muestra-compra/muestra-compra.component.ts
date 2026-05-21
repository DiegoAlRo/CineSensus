/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Reserva } from '../../modelos/reserva';
import { ReservasService } from '../../servicios/reservas.service';
import { ToastService } from '../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-muestra-compra',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './muestra-compra.component.html',
  styleUrls: ['./muestra-compra.component.css'],
})

/* Esta es la clase de la página que muestra la entrada de la reserva recién comprada. */
export class MuestraCompraComponent implements OnInit {
  reserva: Reserva | null = null;

  /* Constructor del componente. */
  constructor(
    private router: Router,
    private reservasService: ReservasService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {

    this.reserva = this.reservasService.reservaActual;
    this.reservasService.datosCompra = null;

    /* Se mostrarán mensajes al usuario respecto al estado de la compra. */
    if (!this.reserva) {
      this.toastService.show('No hay ninguna compra reciente', 'exito');
      this.router.navigate(['/cartelera']);
      return;
    }

    if (!this.reserva.sesion) {
      this.toastService.show('La sesión ya no está disponible', 'error');
      this.router.navigate(['/cartelera']);
      return;
    }

    if (!this.reserva.sesion.sala) {
      this.toastService.show('La sala ya no existe', 'error');
      this.router.navigate(['/cartelera']);
      return;
    }
  }

  /* Se le dará formato a los asientos. */
  formatearAsiento(a: { fila: number; columna: number }) {
    const letra = String.fromCharCode(65 + a.fila);
    const numero = a.columna + 1;
    return `${letra}${numero}`;
  }
}
