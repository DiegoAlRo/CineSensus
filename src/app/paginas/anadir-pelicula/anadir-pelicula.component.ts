/* Imports necesarios para el componente AnadirPeliculaComponent. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';
import { Genero } from '../../enums/genero';
import { Tono } from '../../enums/tono';

/* Decorador @Component que define el selector, las dependencias, la plantilla y los estilos del componente AnadirPeliculaComponent. */
@Component({
  selector: 'app-anadir-pelicula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './anadir-pelicula.component.html',
  styleUrls: ['./anadir-pelicula.component.css']
})

/* Clase AnadirPeliculaComponent que se encarga de añadir una nueva película. */
export class AnadirPeliculaComponent {

  generos = Object.values(Genero);

  /* Objeto "pelicula" que se vincula al formulario para añadir una nueva película. */
  pelicula: Pelicula = {
    
    id: '',
    titulo: '',
    genero: Genero.Accion,  // Valor por defecto.
    director: '',
    sinopsis: '',
    puntuacionMedia: 0,
    entradasVendidas: 0,
    tono: Tono.Neutral,      // valor por defecto.
    duracion: 90,
    poster: '',
    trailer: ''
  };
    
  /* Constructor que conecta servicio PeliculasService y el Router. */
  constructor(
    private peliculasService: PeliculasService,
    private router: Router
  ) {}
    
  /* Función "guardar()" que se llama para añadir la película y luego ir a la página de cartelera. */
  guardar() {
    this.peliculasService.addPelicula(this.pelicula).subscribe(() => {
     this.router.navigate(['/cartelera']);
    });
  }

}
