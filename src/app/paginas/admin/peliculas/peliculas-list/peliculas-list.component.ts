import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PeliculasService } from '../../../../servicios/peliculas.service';
import { Pelicula } from '../../../../modelos/pelicula';
import { ToastService } from '../../../../servicios/toast.service';

@Component({
  selector: 'app-pelicula-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './peliculas-list.component.html',
  styleUrls: ['./peliculas-list.component.css'],
})
export class PeliculasListComponent implements OnInit {
  peliculas: Pelicula[] = [];

  constructor(
    private peliculasService: PeliculasService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.peliculasService.getPeliculas().subscribe({
      next: (data) => (this.peliculas = data),
      error: (err) => console.error('Error cargando películas', err),
    });
  }

  crearPelicula() {
    this.router.navigate(['/admin/peliculas/crear']);
  }

  editarPelicula(id: string) {
    this.router.navigate(['/admin/peliculas/editar', id]);
  }

  eliminarPelicula(id: string) {
    if (confirm('¿Seguro que quieres eliminar esta película?')) {
      this.peliculasService.eliminarPelicula(id).subscribe({
        next: () => {
          this.toastService.show('Película eliminada correctamente', 'exito');
          this.cargarPeliculas();
        },
        error: () => {
          this.toastService.show('Error al eliminar la película', 'error');
        }
      });
    }
  }
}