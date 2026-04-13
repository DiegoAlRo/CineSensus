import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Reserva } from '../../modelos/reserva';

@Component({
  selector: 'app-muestra-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './muestra-compra.component.html',
  styleUrl: './muestra-compra.component.css'
})

export class MuestraCompraComponent implements OnInit {

  reserva!: Reserva;

  constructor(private router: Router) {}

  ngOnInit() {
    const state = history.state;

    if (!state || !state.reserva) {
      this.router.navigate(['/cartelera']);
      return;
    }

    this.reserva = state.reserva;
  }

  formatearAsiento(a: { fila: number; columna: number }) {
    const letra = String.fromCharCode(65 + a.fila);
    const numero = a.columna + 1;
    return `${letra}${numero}`;
  }
}