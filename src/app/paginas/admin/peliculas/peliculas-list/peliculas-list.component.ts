/* imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeliculasService } from '../../../../servicios/peliculas.service';
import { Pelicula } from '../../../../modelos/pelicula';
import { ToastService } from '../../../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-pelicula-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './peliculas-list.component.html',
  styleUrls: ['./peliculas-list.component.css'],
})

/* Esta es la clase del componente de la lista de peliculas para el admin. */
export class PeliculasListComponent implements OnInit {

  /* Propiedades del componente. */
  peliculas: Pelicula[] = [];
  peliculasFiltradas: Pelicula[] = [];
  filtroTexto = '';
  paginaActual = 1;
  elementosPorPagina = 10;

  /* Constructor del componente. */
  constructor(
    private peliculasService: PeliculasService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    /* Se cargarán las películas desde el principio. */
    this.cargarPeliculas();
  }

  /* Este método mostrará las películas de la base de datos. */
  cargarPeliculas() {
    this.peliculasService.getPeliculas().subscribe({
      next: (data) => {

        /* Se filtrarán para mostrar solo las películas activas, ordenadas de forma que se ven primero las creadas más recientemente. */
        this.peliculas = data.filter(p => p.activo).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        this.peliculasFiltradas = this.peliculas;
        this.paginaActual = 1;
      },
      error: (err) => console.error('Error cargando películas', err),
    });
  }

  /* Este método será para el buscador de películas.*/
  aplicarFiltros() {
    const texto = this.filtroTexto.toLowerCase();

    /* Se mostrarán las películas cuyo título tenga texto que coincida con el especificado. */
    this.peliculasFiltradas = this.peliculas.filter((p) =>
      p.titulo.toLowerCase().includes(texto),
    );
    this.paginaActual = 1;
  }

  get peliculasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.peliculasFiltradas.slice(inicio, fin);
  }

  /* Le aplicará la paginación a las películas filtradas. */
  get totalPaginas() {
    return Math.ceil(this.peliculasFiltradas.length / this.elementosPorPagina);
  }

  /* Este método enviara al admin al formulario para crear una película. */
  crearPelicula() {
    this.router.navigate(['/admin/peliculas/crear']);
  }

  /* Este método enviara al admin al formulario para editar una película. */
  editarPelicula(id: string) {
    const pelicula = this.peliculas.find((p) => p.id === id);
    if (pelicula && !pelicula.activo) {
      this.toastService.show('No puedes editar una película eliminada', 'error');
      return;
    }

    this.router.navigate(['/admin/peliculas/editar', id]);
  }

  /* Este método eliminará una película. */
  eliminarPelicula(id: string) {

    /* Primero se le solicitará confirmación al admin. */
    if (confirm('¿Seguro que quieres eliminar esta película?')) {
      this.peliculasService.eliminarPelicula(id).subscribe({
        next: () => {
          this.toastService.show('Película eliminada correctamente', 'exito');
          this.cargarPeliculas();
        },
        error: () => {
          this.toastService.show('Error al eliminar la película', 'error');
        },
      });
    }
  }
}
