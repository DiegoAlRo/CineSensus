import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';

@Component({
  selector: 'app-info-pelicula',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './info-pelicula.component.html',
  styleUrls: ['./info-pelicula.component.css']
})

export class InfoPeliculaComponent implements OnInit {
  
  pelicula?: Pelicula;
  
  constructor(
    private route: ActivatedRoute,
    private peliculasService: PeliculasService
  ) {}
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.peliculasService.getPelicula(id).subscribe(p => {
      this.pelicula = p;
    });
  }
}
