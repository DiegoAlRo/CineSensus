/* Importaciones necesarias para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';

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
  
  pelicula: Pelicula = {
    id: 0,
    titulo: '',
    genero: '',
    director: '',
    descripcion: '',
    imagen: ''
  };
    
  /* Constructor para inyectar servicios necesarios. */
  constructor(

    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private router: Router
  ) {}
    
  /* Método ngOnInit para cargar la película a editar al iniciar el componente. */
  ngOnInit(): void {
      
     const id = Number(this.route.snapshot.paramMap.get('id'));
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
