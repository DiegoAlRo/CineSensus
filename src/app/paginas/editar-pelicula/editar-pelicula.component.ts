import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';

@Component({
  selector: 'app-editar-pelicula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-pelicula.component.html',
  styleUrls: ['./editar-pelicula.component.css']
})

export class EditarPeliculaComponent implements OnInit {
  
  pelicula: Pelicula = {
    id: 0,
    titulo: '',
    genero: '',
    director: '',
    descripcion: '',
    imagen: ''
  };
    
  constructor(

    private route: ActivatedRoute,
    private peliculasService: PeliculasService,
    private router: Router
  ) {}
    
  ngOnInit(): void {
      
     const id = Number(this.route.snapshot.paramMap.get('id'));
    this.peliculasService.getPelicula(id).subscribe(p => {
       this.pelicula = p;
     });

   } guardar() {
      
    this.peliculasService.actualizarPelicula(this.pelicula).subscribe(() => {
       this.router.navigate(['/cartelera']);
    });
  }
}
