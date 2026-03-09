/* Importaciones necesarias para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';
import { Genero } from '../../enums/genero';
import { Tono } from '../../enums/tono';

/* Decorador del componente con su configuración. */
@Component({
  selector: 'app-editar-pelicula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-pelicula.component.html',
  styleUrls: ['./editar-pelicula.component.css']
})

/* Clase del componente que implementa OnInit para inicializar datos. */
export class EditarPeliculaComponent implements OnInit {

  generos = Object.values(Genero);
  
  pelicula: Pelicula = {
    id: '',
    titulo: '',
    director: '',
    genero: Genero.Accion,
    sinopsis: '',
    puntuacionMedia: 0,
    entradasVendidas: 0,
    tono: Tono.Neutral,
    duracion: 90,
    poster: '',
    trailer: ''
  };
    
  /* Constructor para inyectar servicios necesarios. */
  constructor(

    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private router: Router
  ) {}
    
  /* Método ngOnInit para cargar la película a editar al iniciar el componente. */
  ngOnInit(): void {
      
     const id = this.route.snapshot.paramMap.get('id')!;
    this.peliculasService.getPelicula(id).subscribe(p => {
       this.pelicula = p;
     });

     /* Método para guardar los cambios realizados en la película. */
   } guardar() {
      
    this.peliculasService.actualizarPelicula(this.pelicula).subscribe(() => {
       this.router.navigate(['/cartelera']);
    });
  }
}
