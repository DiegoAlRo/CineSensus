/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../../servicios/reservas.service';
import { Reserva } from '../../../modelos/reserva';
import { ToastService } from '../../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})

/* Clase del componente de lista de reservas para el admin. */
export class ReservasComponent implements OnInit {

  /* Propiedades del componente. */
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  filtroEmail = '';
  filtroPelicula = '';
  filtroCodigo = '';
  filtroFecha = '';
  paginaActual = 1;
  elementosPorPagina = 10;

  /* Constructor del componente. */
  constructor(
    private reservasService: ReservasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    /* Las reservas se cargan desde un inicio. */
    this.cargarReservas();
  }

  /* Este método cargará todas las reservas. */
  cargarReservas() {
    this.reservasService.getTodasReservas().subscribe({
      next: (data) => {

        /* Se ordenarán de forma descendente. */
        this.reservas = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        this.reservasFiltradas = this.reservas;
        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar reservas', 'error'),
    });
  }

  /* Este método aplicará los filtros d ebúsqueda. */
  aplicarFiltros() {

    /* Se obtendrán los datos especificados. */
    const email = this.filtroEmail.toLowerCase();
    const peliculaTexto = this.filtroPelicula.toLowerCase();
    const codigoTexto = this.filtroCodigo.toLowerCase();

    /* Se aplicarán los filtros. */
    this.reservasFiltradas = this.reservas.filter((r) => {

      const coincideEmail = r.usuario?.email?.toLowerCase().includes(email);

      const coincidePelicula = r.pelicula?.titulo?.toLowerCase().includes(peliculaTexto);

      const coincideFecha = !this.filtroFecha || (r.sesion && r.sesion.fecha?.slice(0, 10) === this.filtroFecha);

      const coincideCodigo = r.codigoEntrada?.toLowerCase().includes(codigoTexto);

      return coincideEmail && coincidePelicula && coincideFecha && coincideCodigo;
    });
    this.paginaActual = 1;
  }

  /* Se aplicará la paginación a las reservas. */
  get reservasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.reservasFiltradas.slice(inicio, fin);
  }

  /* Se obtendrán todas las páginas. */
  get totalPaginas() {
    return Math.ceil(this.reservasFiltradas.length / this.elementosPorPagina);
  }

  /* Estos métodos servirán para navegar entre las páginas. */
  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  /* Este método alternará el estado de la reserva. */
  cambiarEstado(reserva: Reserva, nuevoEstado: string) {
    const estadoAnterior = reserva.estado;

    /* Se le pedirá confirmación al admin. */
    if (!confirm(`¿Seguro que quieres cambiar el estado a "${nuevoEstado}"?`)) {
      reserva.estado = estadoAnterior;
      return;
    }

    /* Se llamará al servicio para actualizar la reserva. */
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

  /* Se formatearán los asientos. */
  formatearAsientos(asientos: { fila: number; columna: number }[]) {
    return asientos
      .map((a) => String.fromCharCode(65 + a.fila) + (a.columna + 1))
      .join(', ');
  }
}
