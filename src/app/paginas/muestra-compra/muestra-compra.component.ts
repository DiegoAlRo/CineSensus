import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Reserva } from '../../modelos/reserva';
import { ReservasService } from '../../servicios/reservas.service';

@Component({
  selector: 'app-muestra-compra',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './muestra-compra.component.html',
  styleUrls: ['./muestra-compra.component.css'],
})
export class MuestraCompraComponent implements OnInit {
  reserva: Reserva | null = null;

  constructor(private router: Router, private reservasService: ReservasService) {}

  ngOnInit() {
    this.reserva = this.reservasService.reservaActual;

    if (!this.reserva) {
      this.router.navigate(['/cartelera']);
      return;
    }
  }

  formatearAsiento(a: { fila: number; columna: number }) {
    const letra = String.fromCharCode(65 + a.fila);
    const numero = a.columna + 1;
    return `${letra}${numero}`;
  }
}
