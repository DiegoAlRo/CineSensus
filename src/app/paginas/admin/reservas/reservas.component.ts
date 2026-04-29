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
  peliculasUnicas: { id: string; titulo: string }[] = [];

  filtroEmail = '';
  filtroPelicula = '';
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
        this.reservas = data;
        this.reservasFiltradas = data;

        this.generarPeliculasUnicas();
        this.paginaActual = 1; 
      },
      error: () => this.toastService.show('Error al cargar reservas', 'error'),
    });
  }

  generarPeliculasUnicas() {
    const mapa = new Map<string, string>();

    for (const r of this.reservas) {
      mapa.set(r.pelicula.id, r.pelicula.titulo);
    }

    this.peliculasUnicas = Array.from(mapa, ([id, titulo]) => ({ id, titulo }));
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
