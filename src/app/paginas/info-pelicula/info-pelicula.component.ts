/* Imports necesarios para el componente de información de película. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';

/* Decorador del componente con su configuración. */
@Component({
  selector: 'app-info-pelicula',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './info-pelicula.component.html',
  styleUrls: ['./info-pelicula.component.css']
})

/* Clase del componente de información de película. */
export class InfoPeliculaComponent implements OnInit {
  
  pelicula?: Pelicula;
  
  /* Constructor que inyecta los servicios necesarios para obtener la información de la película. */
  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService
  ) {}
  
  /* Método que se ejecuta al inicializar el componente, obtiene el ID de la película de la ruta y llama al servicio para obtener su información. */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.peliculasService.getPelicula(id).subscribe(p => {
      this.pelicula = p;
    });
  }
}
