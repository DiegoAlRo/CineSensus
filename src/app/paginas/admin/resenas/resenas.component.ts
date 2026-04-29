import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResenasService } from '../../../servicios/resenas.service';
import { Resena } from '../../../modelos/resena';
import { ToastService } from '../../../servicios/toast.service';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resenas.component.html',
  styleUrls: ['./resenas.component.css'],
})
export class ResenasComponent implements OnInit {
  resenas: Resena[] = [];
  resenasFiltradas: Resena[] = [];
  peliculasUnicas: { id: string; titulo: string }[] = [];

  filtroEmail = '';
  filtroPelicula = '';

  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private resenasService: ResenasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarResenas();
  }

  cargarResenas() {
    this.resenasService.getTodasResenas().subscribe({
      next: (data) => {
        this.resenas = data;
        this.resenasFiltradas = data;

        this.generarPeliculasUnicas();
        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar reseñas', 'error'),
    });
  }

  generarPeliculasUnicas() {
    const mapa = new Map<string, string>();

    for (const r of this.resenas) {
      mapa.set(r.pelicula.id, r.pelicula.titulo);
    }

    this.peliculasUnicas = Array.from(mapa, ([id, titulo]) => ({ id, titulo }));
  }

  aplicarFiltros() {
    const email = this.filtroEmail.toLowerCase();

    this.resenasFiltradas = this.resenas.filter((r) => {
      const coincideEmail = r.usuario.email?.toLowerCase().includes(email);
      const coincidePelicula =
        !this.filtroPelicula || r.pelicula.id === this.filtroPelicula;

      return coincideEmail && coincidePelicula;
    });
    this.paginaActual = 1;
  }

  get resenasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.resenasFiltradas.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.resenasFiltradas.length / this.elementosPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  eliminarResena(id: string) {
    if (!confirm('¿Seguro que quieres eliminar esta reseña?')) return;

    this.resenasService.eliminarResena(id).subscribe({
      next: () => {
        this.toastService.show('Reseña eliminada correctamente', 'exito');
        this.cargarResenas();
      },
      error: () => this.toastService.show('Error al eliminar reseña', 'error'),
    });
  }
}
