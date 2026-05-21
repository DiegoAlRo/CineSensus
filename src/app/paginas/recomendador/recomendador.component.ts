/* Imports necesarios para el recomendador. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Genero } from '../../enums/genero';
import { Tono } from '../../enums/tono';
import { Pelicula } from '../../modelos/pelicula';
import { RecomendadorService } from '../../servicios/recomendador.service';
import { ToastService } from '../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-recomendador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recomendador.component.html',
  styleUrls: ['./recomendador.component.css'],
})

/* Esta será la clase del recomendador, que recibirá una serie de datos y recomendará la opción más cercana. */
export class RecomendadorComponent {

  /* propiedades del componente. */
  form: FormGroup;
  peliculaRecomendada: Pelicula | null = null;
  buscando = false;
  generos = Object.values(Genero);
  tonos = Object.values(Tono);
  puntuaciones = [1, 2, 3, 4, 5];
  edades = ['TP', '7', '12', '16', '18'];
  duraciones = ['Menos de 90 min', 'Entre 90 - 120 min', 'Más de 120 min'];

  /* Contructor del recomendador. */
  constructor(
    private fb: FormBuilder,
    private recomendadorService: RecomendadorService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      genero: [this.generos[0]],
      tono: [this.tonos[0]],
      duracion: [this.duraciones[0]],
      edad: [this.edades[0]],
      puntuacion: [this.puntuaciones[0]],
    });
  }

  /* Este método buscará coincidencias basadas en los datos para mostrar la película más parecida. */
  recomendar() {

    this.buscando = true;
    this.peliculaRecomendada = null;

    /* Se determinan cuales serán los filtros. */
    const filtros = {
      genero: this.form.value.genero,
      tono: this.form.value.tono,
      duracion: this.form.value.duracion,
      edad: this.form.value.edad === 'TP' ? 0 : Number(this.form.value.edad),
      puntuacion: Number(this.form.value.puntuacion),
    };

    /* Se llamará al servicio para recomedar una película, enviando los filtros. */
    this.recomendadorService.recomendarPelicula(filtros).subscribe({
      next: (pelicula) => {

        /* Se indicará que ya no se está buscando nada, para cambiar de nuevo el html. */
        this.buscando = false;

        if (!pelicula) {
          this.toastService.show(
            'No encontramos ninguna película que encaje con lo que buscas',
            'error',
          );
          return;
        }

        if (!pelicula.activo) {
          this.toastService.show('La película ya no está disponible', 'error');
          return;
        }

        if (!pelicula.sesiones || pelicula.sesiones.length === 0) {
          this.toastService.show(
            'La película ya no tiene sesiones disponibles',
            'error',
          );
          return;
        }

        this.toastService.show(
          'Pensamos que esta película podría gustarte',
          'exito',
        );

        this.peliculaRecomendada = pelicula;
      },
      error: () => {
        this.buscando = false;
        this.toastService.show('No se pudo obtener una recomendación', 'error');
      },
    });
  }

  /* Este método enviará al usuario a la info-pelicula de la misma, si este hace click sobre la tarjeta. */
  irAPelicula(id: string) {
    this.router.navigate(['/pelicula', id]);
  }
}
