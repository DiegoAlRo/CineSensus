import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PeliculasService } from '../../../../servicios/peliculas.service';
import { Genero } from '../../../../enums/genero';
import { Tono } from '../../../../enums/tono';
import { RestriccionEdad } from '../../../../enums/restriccionEdad';
import { ToastService } from '../../../../servicios/toast.service';

@Component({
  selector: 'app-pelicula-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './peliculas-form.component.html',
  styleUrls: ['./peliculas-form.component.css'],
})
export class PeliculasFormComponent implements OnInit {
  form!: FormGroup;
  modoEdicion = false;
  peliculaId!: string;

  generos = Object.values(Genero);
  tonos = Object.values(Tono);
  restricciones = Object.values(RestriccionEdad);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private peliculasService: PeliculasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
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

    this.peliculaId = this.route.snapshot.params['id'];
    if (this.peliculaId) {
      this.modoEdicion = true;
      this.cargarPelicula();
    }
  }

  cargarPelicula() {
    this.peliculasService.getPelicula(this.peliculaId).subscribe({
      next: (pelicula) => this.form.patchValue(pelicula),
      error: (err) => console.error('Error cargando película', err),
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Completa todos los campos obligatorios', 'error');
      return;
    }

    const datos = this.form.value;

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

  cancelar() {
    this.router.navigate(['/admin/peliculas']);
  }
}
