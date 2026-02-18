/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';

/* Decorador que define el componente. */
@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cartelera.component.html',
  styleUrls: ['./cartelera.component.css']
})

/* Clase del componente que implementa la interfaz OnInit para inicializar datos al cargar la página. */
export class CarteleraComponent implements OnInit {

  /* Propiedades del componente */
  peliculas: Pelicula[] = [];
  usuarioLogueado: any = null;

  /* Constructor que inyecta los servicios necesarios para obtener datos de películas y manejar la navegación. */
  constructor(
    private peliculasService: PeliculasService,
    private router: Router
  ) { }

  /* Método que se ejecuta al inicializar el componente, obtiene la lista de películas y verifica si hay un usuario logueado. */
  ngOnInit(): void { 

    const data = localStorage.getItem('usuario');
    
    if (data) {
      this.usuarioLogueado = JSON.parse(data);
    }
    
    this.peliculasService.getPeliculas().subscribe(peliculas => {
      this.peliculas = peliculas;
    });
  }

  /* Método para navegar a la página de edición de una película. */
  editarPelicula(pelicula: Pelicula, event: Event) {
    
    event.stopPropagation();
    this.router.navigate(['/editar', pelicula.id]);
  }
  
  /* Método para eliminar una película, muestra una confirmación antes de proceder con la eliminación. */
  eliminarPelicula(id: number, event: Event) {
    
    event.stopPropagation();
    
    /* Confirmación para eliminar la película. */
    if (confirm('¿Seguro que quieres eliminar esta película?')) {
      
      this.peliculasService.eliminarPelicula(id).subscribe(() => {
        this.peliculas = this.peliculas.filter(p => p.id !== id);
      });
    }
  }

}
