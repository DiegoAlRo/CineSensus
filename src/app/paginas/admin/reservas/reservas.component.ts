import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservasService } from '../../../servicios/reservas.service';
import { Reserva } from '../../../modelos/reserva';
import { ToastService } from '../../../servicios/toast.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];

  filtroEmail = '';
  filtroPelicula = '';
  filtroFecha = '';

  constructor(
    private reservasService: ReservasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas() {
    debugger
    this.reservasService.getTodasReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = data;
      },
      error: () => this.toastService.show('Error al cargar reservas', 'error'),
    });
  }

  aplicarFiltros() {
    const email = this.filtroEmail.toLowerCase();

    this.reservasFiltradas = this.reservas.filter((r) => {
      const coincideEmail = r.usuario.email.toLowerCase().includes(email);
      const coincidePelicula =
        !this.filtroPelicula || r.pelicula.id === this.filtroPelicula;
      const coincideFecha =
        !this.filtroFecha || r.sesion.fecha.slice(0, 10) === this.filtroFecha;

      return coincideEmail && coincidePelicula && coincideFecha;
    });
  }

  cambiarEstado(reserva: Reserva, nuevoEstado: string) {
    const estadoAnterior = reserva.estado;

    if (!confirm(`¿Seguro que quieres cambiar el estado a "${nuevoEstado}"?`)) {
      reserva.estado = estadoAnterior;
      return;
    }

    this.reservasService
      .actualizarEstado(reserva.id, nuevoEstado as any)
      .subscribe({
        next: (res) => {
          reserva.estado = res.estado;
          this.toastService.show('Estado actualizado correctamente', 'exito');
        },
        error: () => {
          reserva.estado = estadoAnterior;
          this.toastService.show('Error al actualizar el estado', 'error');
        },
      });
  }

  formatearAsientos(asientos: { fila: number; columna: number }[]) {
    return asientos
      .map((a) => String.fromCharCode(65 + a.fila) + (a.columna + 1))
      .join(', ');
  }
}
