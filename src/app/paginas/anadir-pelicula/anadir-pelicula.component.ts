/* Imports necesarios para el componente AnadirPeliculaComponent. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';

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

  /* Objeto "pelicula" que se vincula al formulario para añadir una nueva película. */
  pelicula: Pelicula = {
    
    id: 0,
    titulo: '',
    genero: '',
    director: '',
    descripcion: '',
    imagen: ''
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
