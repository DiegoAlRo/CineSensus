import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SesionesService } from '../../../../servicios/sesiones.service';
import { Sesion } from '../../../../modelos/sesion';
import { ToastService } from '../../../../servicios/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sesiones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sesiones-list.component.html',
  styleUrls: ['./sesiones-list.component.css'],
})
export class SesionesListComponent implements OnInit {
  sesiones: Sesion[] = [];
  sesionesFiltradas: Sesion[] = [];
  salasUnicas: { id: string; nombre: string }[] = [];

  filtroTexto = '';
  filtroSala = '';
  filtroFecha = '';

  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private sesionesService: SesionesService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarSesiones();
  }

  cargarSesiones() {
    this.sesionesService.getTodas().subscribe({
      next: (data) => {
        this.sesiones = data.filter((s) => s.activo && s.pelicula && s.sala).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        this.sesionesFiltradas = this.sesiones;

        this.generarSalasUnicas();

        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar sesiones', 'error'),
    });
  }

  generarSalasUnicas() {
    const mapa = new Map<string, string>();

    for (const s of this.sesiones) {
      if (s.sala && s.pelicula) {
        mapa.set(s.sala.id, s.sala.nombre);
      }
    }

    this.salasUnicas = Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  }

  aplicarFiltros() {
    const texto = this.filtroTexto.toLowerCase();

    this.sesionesFiltradas = this.sesiones.filter((s) => {
      const coincideTexto =
        s.pelicula?.titulo?.toLowerCase().includes(texto) ||
        s.sala?.nombre?.toLowerCase().includes(texto) ||
        s.hora.includes(texto) ||
        s.fecha.includes(texto);

      const coincideSala = !this.filtroSala || s.sala.id === this.filtroSala;

      const coincideFecha =
        !this.filtroFecha || s.fecha.slice(0, 10) === this.filtroFecha;

      return coincideTexto && coincideSala && coincideFecha;
    });
    this.paginaActual = 1;
  }

  get sesionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.sesionesFiltradas.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.sesionesFiltradas.length / this.elementosPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  crearSesion() {
    this.router.navigate(['/admin/sesiones/crear']);
  }

  editarSesion(id: string) {
    const sesion = this.sesiones.find((s) => s.id === id);

    if (!sesion) return;

    if (!sesion.activo) {
      this.toastService.show(
        'No es posible editar una sesión eliminada',
        'error',
      );
      return;
    }

    const fecha = new Date(sesion.fecha);
    const h = Number(sesion.hora.slice(0, 2));
    const m = Number(sesion.hora.slice(2, 4));
    fecha.setHours(h, m);

    if (fecha < new Date()) {
      this.toastService.show('No es posible editar una sesión pasada', 'error');
      return;
    }

    this.router.navigate(['/admin/sesiones/editar', id]);
  }

  eliminarSesion(id: string) {
    if (confirm('¿Seguro que quieres eliminar esta sesión?')) {
      this.sesionesService.eliminarSesion(id).subscribe({
        next: () => {
          this.toastService.show('Sesión eliminada correctamente', 'exito');
          this.cargarSesiones();
        },
        error: () =>
          this.toastService.show('Error al eliminar sesión', 'error'),
      });
    }
  }
}
