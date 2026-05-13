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
  filtroCodigo = '';
  filtroFecha = '';

  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private reservasService: ReservasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas() {
    this.reservasService.getTodasReservas().subscribe({
      next: (data) => {
        this.reservas = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        this.reservasFiltradas = this.reservas;

        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar reservas', 'error'),
    });
  }

  aplicarFiltros() {
    const email = this.filtroEmail.toLowerCase();
    const peliculaTexto = this.filtroPelicula.toLowerCase();
    const codigoTexto = this.filtroCodigo.toLowerCase();

    this.reservasFiltradas = this.reservas.filter((r) => {

      const coincideEmail = r.usuario?.email?.toLowerCase().includes(email);

      const coincidePelicula = r.pelicula?.titulo?.toLowerCase().includes(peliculaTexto);

      const coincideFecha = !this.filtroFecha || (r.sesion && r.sesion.fecha?.slice(0, 10) === this.filtroFecha);

      const coincideCodigo = r.codigoEntrada?.toLowerCase().includes(codigoTexto);

      return coincideEmail && coincidePelicula && coincideFecha && coincideCodigo;
    });
    this.paginaActual = 1;
  }

  get reservasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.reservasFiltradas.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.reservasFiltradas.length / this.elementosPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
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
        error: (err) => {
          reserva.estado = estadoAnterior;

          if (err.status === 409) {
            this.toastService.show(
              'No se puede marcar como pagada: los asientos ya están ocupados',
              'error',
            );
            return;
          }

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
