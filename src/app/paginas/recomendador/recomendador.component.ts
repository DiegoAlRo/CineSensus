import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Genero } from '../../enums/genero';
import { Tono } from '../../enums/tono';
import { Pelicula } from '../../modelos/pelicula';
import { RecomendadorService } from '../../servicios/recomendador.service';
import { ToastService } from '../../servicios/toast.service';

@Component({
  selector: 'app-recomendador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recomendador.component.html',
  styleUrls: ['./recomendador.component.css'],
})
export class RecomendadorComponent {
  form: FormGroup;

  peliculaRecomendada: Pelicula | null = null;
  buscando = false;

  generos = Object.values(Genero);
  tonos = Object.values(Tono);

  puntuaciones = [1, 2, 3, 4, 5];

  edades = ['TP', '7', '12', '16', '18'];

  duraciones = ['Menos de 90 min', 'Entre 90 - 120 min', 'Más de 120 min'];

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

  recomendar() {
    this.buscando = true;
    this.peliculaRecomendada = null;

    const filtros = {
      genero: this.form.value.genero,
      tono: this.form.value.tono,
      duracion: this.form.value.duracion,
      edad: this.form.value.edad === 'TP' ? 0 : Number(this.form.value.edad),
      puntuacion: Number(this.form.value.puntuacion),
    };

    this.recomendadorService.recomendarPelicula(filtros).subscribe({
      next: (pelicula) => {
        this.buscando = false;

        if (!pelicula) {
          this.toastService.show(
            'No encontramos ninguna película que encaje con lo que buscas',
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

  irAPelicula(id: string) {
    this.router.navigate(['/pelicula', id]);
  }
}
