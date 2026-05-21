/* Imports necesarios del formulario. */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PeliculasService } from '../../../../servicios/peliculas.service';
import { Genero } from '../../../../enums/genero';
import { Tono } from '../../../../enums/tono';
import { RestriccionEdad } from '../../../../enums/restriccionEdad';
import { ToastService } from '../../../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-pelicula-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './peliculas-form.component.html',
  styleUrls: ['./peliculas-form.component.css'],
})

/* Clase del componente de formulario de películas del admin. */
export class PeliculasFormComponent implements OnInit {

  /* propiedades del componente. */
  form!: FormGroup;
  modoEdicion = false;
  peliculaId!: string;
  generos = Object.values(Genero);
  tonos = Object.values(Tono);
  restricciones = Object.values(RestriccionEdad);

  /* Constructor del componente. */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private peliculasService: PeliculasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    /* Se especificarán las validaciones del formulario reactivo. */
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      director: [''],
      genero: ['', Validators.required],
      tono: ['', Validators.required],
      restriccionEdad: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(1)]],
      poster: ['', Validators.required],
      trailer: [''],
      sinopsis: ['', Validators.required],
    });

    /* En caso de ser una película existente, se activará el modo edición y obtendrán los datos a editar. */
    this.peliculaId = this.route.snapshot.params['id'];
    if (this.peliculaId) {
      this.modoEdicion = true;
      this.cargarPelicula();
    }
  }

  /* Este método cargará la película para editarla. */
  cargarPelicula() {
    this.peliculasService.getPelicula(this.peliculaId).subscribe({
      next: (pelicula) => {

        /* Se evitará la edición si la película esta eliminada. */
        if (!pelicula.activo) {
          this.toastService.show('Esta película está eliminada y no puede editarse', 'error');
          this.router.navigate(['/admin/peliculas']);
          return;
        }

        /* Se rellenará el formulario con los datos. */
        this.form.patchValue(pelicula);
      },
  
      error: (err) => console.error('Error cargando película', err),

    });
  }

  /* Este método servirá para guardar los datos introducidos/cambiados de la película. */
  guardar() {

    /* Se comprobarán que se han introducido todos los datos. */
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Completa todos los campos obligatorios', 'error');
      return;
    }

    /* Se obtendrán los datos del formulario. */
    const datos = this.form.value;

    /* En caso de estar editando una película, se le aplicarán los cambios. */
    if (this.modoEdicion) {
      this.peliculasService.editarPelicula(this.peliculaId, datos).subscribe({
        next: () => {
          this.toastService.show('Película actualizada correctamente', 'exito');
          this.router.navigate(['/admin/peliculas']);
        },
        error: () => {
          this.toastService.show('Error al actualizar la película', 'error');
        },
      });
    } else {

      /* En caso de estar creando una película, esta se generará. */
      this.peliculasService.crearPelicula(datos).subscribe({
        next: () => {
          this.toastService.show('Película creada correctamente', 'exito');
          this.router.navigate(['/admin/peliculas']);
        },
        error: () => {
          this.toastService.show('Error al crear la película', 'error');
        },
      });
    }
  }

  /* Este método cancelará el proceso y enviará al admin a la lista de películas. */
  cancelar() {
    this.router.navigate(['/admin/peliculas']);
  }
}
