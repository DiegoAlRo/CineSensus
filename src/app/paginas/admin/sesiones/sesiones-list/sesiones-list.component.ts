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
  peliculasUnicas: { id: string; titulo: string }[] = [];
  salasUnicas: { id: string; nombre: string }[] = [];

  filtroTexto = '';
  filtroPelicula = '';
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
        this.sesiones = data;
        this.sesionesFiltradas = data;

        this.generarPeliculasUnicas();
        this.generarSalasUnicas();

        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar sesiones', 'error'),
    });
  }

  generarPeliculasUnicas() {
    const mapa = new Map<string, string>();

    for (const s of this.sesiones) {
      mapa.set(s.pelicula.id, s.pelicula.titulo);
    }

    this.peliculasUnicas = Array.from(mapa, ([id, titulo]) => ({ id, titulo }));
  }

  generarSalasUnicas() {
    const mapa = new Map<string, string>();

    for (const s of this.sesiones) {
      mapa.set(s.sala.id, s.sala.nombre);
    }

    this.salasUnicas = Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  }

  aplicarFiltros() {
    const texto = this.filtroTexto.toLowerCase();

    this.sesionesFiltradas = this.sesiones.filter((s) => {
      const coincideTexto =
        s.pelicula.titulo.toLowerCase().includes(texto) ||
        s.sala.nombre.toLowerCase().includes(texto) ||
        s.hora.includes(texto) ||
        s.fecha.includes(texto);

      const coincidePelicula =
        !this.filtroPelicula || s.pelicula.id === this.filtroPelicula;

      const coincideSala = !this.filtroSala || s.sala.id === this.filtroSala;

      const coincideFecha =
        !this.filtroFecha || s.fecha.slice(0, 10) === this.filtroFecha;

      return coincideTexto && coincidePelicula && coincideSala && coincideFecha;
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
