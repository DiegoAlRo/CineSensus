/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResenasService } from '../../../servicios/resenas.service';
import { Resena } from '../../../modelos/resena';
import { ToastService } from '../../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resenas.component.html',
  styleUrls: ['./resenas.component.css'],
})

/* Esta será la clase del componente de lista de reseñas para el admin. */
export class ResenasComponent implements OnInit {

  /* Propiedades del componente. */
  resenas: Resena[] = [];
  resenasFiltradas: Resena[] = [];
  filtroEmail = '';
  filtroPelicula = '';
  paginaActual = 1;
  elementosPorPagina = 10;

  /* Constructor del componente. */
  constructor(
    private resenasService: ResenasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    /* Se cargarán las reseñas desde el inicio. */
    this.cargarResenas();
  }

  /* Este método cargará las reseñas. */
  cargarResenas() {
    this.resenasService.getTodasResenas().subscribe({
      next: (data) => {

        /* Se mostrarán las reservas más recientes primero. */
        this.resenas = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        this.resenasFiltradas = this.resenas;
        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar reseñas', 'error'),
    });
  }

  /* Este método aplicará las especificaciones de los filtros para mostrar las reseñas. */
  aplicarFiltros() {

    /* Se obtendrán los datos de los campos de texto. */
    const email = this.filtroEmail.toLowerCase();
    const peliculaTexto = this.filtroPelicula.toLowerCase();

    /* Se buscarán las coincidencias. */
    this.resenasFiltradas = this.resenas.filter((r) => {
      const coincideEmail = r.usuario?.email?.toLowerCase().includes(email);
      const coincidePelicula = r.pelicula?.titulo?.toLowerCase().includes(peliculaTexto);

      return coincideEmail && coincidePelicula;
    });
    this.paginaActual = 1;
  }

  /* Se aplicará la paginación a las reseñas filtradas. */
  get resenasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.resenasFiltradas.slice(inicio, fin);
  }

  /*Se obtendrán todas las páginas de las reseñas filtradas. */
  get totalPaginas() {
    return Math.ceil(this.resenasFiltradas.length / this.elementosPorPagina);
  }

  /* Estos métodos servirán para navegar entre páginas. */
  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  /* Este método servirá para eliminar una reseña. */
  eliminarResena(id: string) {

    /* Se le pedirá confirmación al admin. */
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
