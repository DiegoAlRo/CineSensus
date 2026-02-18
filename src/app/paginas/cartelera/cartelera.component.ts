import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';

@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cartelera.component.html',
  styleUrls: ['./cartelera.component.css']
})

export class CarteleraComponent implements OnInit {

  peliculas: Pelicula[] = [];
  usuarioLogueado: any = null;

  constructor(
    private peliculasService: PeliculasService,
    private router: Router
  ) { }

  ngOnInit(): void { 

    const data = localStorage.getItem('usuario');
    
    if (data) {
      this.usuarioLogueado = JSON.parse(data);
    }
    
    this.peliculasService.getPeliculas().subscribe(peliculas => {
      this.peliculas = peliculas;
    });
  }

  editarPelicula(pelicula: Pelicula, event: Event) {
    
    event.stopPropagation();
    this.router.navigate(['/editar', pelicula.id]);
  }
  
  eliminarPelicula(id: number, event: Event) {
    
    event.stopPropagation();
    
    if (confirm('¿Seguro que quieres eliminar esta película?')) {
      
      this.peliculasService.eliminarPelicula(id).subscribe(() => {
        this.peliculas = this.peliculas.filter(p => p.id !== id);
      });
    }
  }

}
