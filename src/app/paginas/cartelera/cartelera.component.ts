/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PeliculasService } from '../../servicios/peliculas.service';
import { Pelicula } from '../../modelos/pelicula';
import { SelectoresDeMenuComponent } from '../../shared/selectores-de-menu/selectores-de-menu.component';
import { FormsModule } from '@angular/forms';
import { Genero } from '../../enums/genero';
import { Puntuacion } from '../../enums/puntuacion';
import { Tono } from '../../enums/tono';

/* Decorador que define el componente. */
@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [CommonModule, RouterModule, SelectoresDeMenuComponent, FormsModule],
  templateUrl: './cartelera.component.html',
  styleUrls: ['./cartelera.component.css'],
})

/* Clase del componente que implementa la interfaz OnInit para inicializar datos al cargar la página. */
export class CarteleraComponent implements OnInit {

  /* Propiedades del componente */
  peliculasOriginales: Pelicula[] = [];
  peliculas: Pelicula[] = [];
  usuarioLogueado: any = null;
  mostrarFiltro: boolean = false;
  mostrarFecha: boolean = false;
  filtroTitulo: string = '';
  filtroGenero: string = '';
  filtroTono: string = '';
  filtroDuracion: string = '';
  filtroPuntuacion: string = '';
  generos = Object.values(Genero);
  puntuacion = Object.values(Puntuacion).filter((v) => typeof v === 'number');
  tonos = Object.values(Tono);

  /* Constructor que inyecta los servicios necesarios para obtener datos de películas y manejar la navegación. */
  constructor(
    private peliculasService: PeliculasService,
    private router: Router,
  ) {}

  /* Método que se ejecuta al inicializar el componente, obtiene la lista de películas y verifica si hay un usuario logueado. */
  ngOnInit(): void {
    const data = localStorage.getItem('usuario');

    if (data) {
      this.usuarioLogueado = JSON.parse(data);
    }

    this.peliculasService.getPeliculas().subscribe((peliculas) => {
      this.peliculasOriginales = peliculas;
      this.peliculas = peliculas;
    });
  }

  /* Método para aplicar los filtros. */
  aplicarFiltros() {
    this.peliculas = this.peliculasOriginales.filter((p) => {

      /* Filtro por título. */
      if (
        this.filtroTitulo.trim() !== '' &&
        !p.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase())
      ) {
        return false;
      }

      /* Filtro por el enum género. */
      if (this.filtroGenero !== '' && p.genero !== this.filtroGenero) {
        return false;
      }

      /* Filtro por el enum tono. */
      if (this.filtroTono !== '' && p.tono !== this.filtroTono) {
        return false;
      }

      /* Filtro por duración. */
      if (this.filtroDuracion !== '') {
        if (this.filtroDuracion === 'Menos de 90 min' && p.duracion >= 90)
          return false;
        if (
          this.filtroDuracion === 'Entre 90 - 120 min' &&
          (p.duracion < 90 || p.duracion > 120)
        )
          return false;
        if (this.filtroDuracion === 'Más de 120 min' && p.duracion <= 120)
          return false;
      }

      /* Filtro por el enum puntuación media. */
      if (this.filtroPuntuacion !== '') {
        const min = Number(this.filtroPuntuacion);
        if (p.puntuacionMedia < min) return false;
      }

      return true;
    });
  }

  /* Método para desaplicar los filtros. */
  quitarFiltros() {
    this.filtroTitulo = '';
    this.filtroGenero = '';
    this.filtroTono = '';
    this.filtroDuracion = '';
    this.filtroPuntuacion = '';

    this.peliculas = [...this.peliculasOriginales];
  }
}
