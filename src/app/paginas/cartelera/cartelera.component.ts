/* Imports necesarios para el componente. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pelicula } from '../../modelos/pelicula';
import { SelectoresDeMenuComponent } from '../../shared/selectores-de-menu/selectores-de-menu.component';
import { FormsModule } from '@angular/forms';
import { Genero } from '../../enums/genero';
import { Puntuacion } from '../../enums/puntuacion';
import { Tono } from '../../enums/tono';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../modelos/usuario';
import { CarteleraService } from '../../servicios/cartelera.service';

/* Decorador que define el componente. */
@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [CommonModule, SelectoresDeMenuComponent, FormsModule, RouterModule],
  templateUrl: './cartelera.component.html',
  styleUrls: ['./cartelera.component.css'],
})

/* Clase la cartelera que usa OnInit para inicializar datos al cargar la página. */
export class CarteleraComponent implements OnInit {

  /* Propiedades del componente. */
  peliculasOriginales: Pelicula[] = [];
  peliculas: Pelicula[] = [];
  usuarioLogueado: Usuario | null = null;
  mostrarFiltro: boolean = false;
  mostrarFecha: boolean = false;
  filtroTitulo: string = '';
  filtroGenero: string = '';
  filtroTono: string = '';
  filtroEdad: string = '';
  filtroDuracion: string = '';
  filtroPuntuacion: string = '';
  hoy: Date = new Date();
  fechaSeleccionada: Date = new Date();
  mesActual: number = new Date().getMonth();
  anioActual: number = new Date().getFullYear();
  diasCalendario: Date[] = [];
  diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  /* Este getter devuelve el nombre del mes actual en español. */
  get nombreMesActual() {
    return new Date(this.anioActual, this.mesActual, 1).toLocaleDateString(
      'es-ES',
      { month: 'long' },
    );
  }

  /* Este getter devuelve la fecha seleccionada formateada como "DíaSemana DD/MM". */
  get fechaFormateada() {
    const dias = [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
    ];

    const diaSemana = dias[this.fechaSeleccionada.getDay()];
    const dia = this.fechaSeleccionada.getDate().toString().padStart(2, '0');
    const mes = (this.fechaSeleccionada.getMonth() + 1)
      .toString()
      .padStart(2, '0');

    return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia}/${mes}`;
  }

  /* De esta forma la hora de las sesiones se mostrarán como HH:MM. */
  formatearHora(hora: string) {
    return hora.slice(0, 2) + ':' + hora.slice(2, 4);
  }

  /* Este getter evita poder navegar al mes anterior. */
  get puedeIrMesAnterior() {
    const hoy = new Date();
    return !(
      this.anioActual === hoy.getFullYear() && this.mesActual === hoy.getMonth()
    );
  }

  /* Arrays con los valores de los enums para usarlos en los filtros. */
  generos = Object.values(Genero);
  puntuacion = Object.values(Puntuacion).filter(
    (v) => typeof v === 'number',
  ) as number[];
  tonos = Object.values(Tono);

  /* Constructor que inyecta los servicios necesarios para obtener datos de películas y manejar la navegación. */
  constructor(
    private carteleraService: CarteleraService,
    private router: Router,
  ) {}

  /* Método que se ejecuta al inicializar el componente, obtiene la lista de películas y verifica si hay un usuario logueado. */
  ngOnInit(): void {

    /* Se verifica si hay un usuario logueado y se le aportan los datos. */
    const data = localStorage.getItem('usuario');
    if (data) this.usuarioLogueado = JSON.parse(data);

    /* Se carga la cartelera del día actual y se genera el calendario. */
    this.cargarCartelera();
    this.generarCalendario();

    /* Se establece un intervalo para comprobar cada minuto si ha cambiado el día y se actualiza la cartelera y el calendario. */
    setInterval(() => {
      const ahora = new Date();
      if (ahora.getDate() !== this.hoy.getDate()) {
        this.hoy = ahora;
        this.fechaSeleccionada = ahora;
        this.mesActual = ahora.getMonth();
        this.anioActual = ahora.getFullYear();
        this.generarCalendario();
        this.cargarCartelera();
      }
    }, 60000);
  }

  /* Método para cargar la cartelera de películas del día seleccionado. */
  cargarCartelera() {
    const fechaISO = [
      this.fechaSeleccionada.getFullYear(),
      String(this.fechaSeleccionada.getMonth() + 1).padStart(2, '0'),
      String(this.fechaSeleccionada.getDate()).padStart(2, '0'),
    ].join('-');

    this.carteleraService.getCartelera(fechaISO).subscribe({
      next: (peliculas) => {
        this.peliculasOriginales = peliculas;
        this.peliculas = peliculas;
      },
      error: () => {
        this.peliculas = [];
      },
    });
  }

  /* Método para generar el calendario del mes actual, creando un array de fechas que se muestra en la interfaz. */
  generarCalendario() {
    const inicio = new Date(this.anioActual, this.mesActual, 1);
    const fin = new Date(this.anioActual, this.mesActual + 1, 0);

    const dias: Date[] = [];

    const offset = inicio.getDay() === 0 ? 6 : inicio.getDay() - 1;
    for (let i = 0; i < offset; i++) dias.push(null as any);

    for (let d = 1; d <= fin.getDate(); d++) {
      dias.push(new Date(this.anioActual, this.mesActual, d));
    }

    this.diasCalendario = dias;
  }

  /* Método para seleccionar un día del calendario, actualizando la fecha seleccionada. */
  seleccionarDia(dia: Date | null) {
    if (!dia) return;

    const hoySinHora = new Date(
      this.hoy.getFullYear(),
      this.hoy.getMonth(),
      this.hoy.getDate(),
    );

    const diaSinHora = new Date(
      dia.getFullYear(),
      dia.getMonth(),
      dia.getDate(),
    );

    if (diaSinHora < hoySinHora) return;

    /* Junto a la fecha, se actualizarán las sesiones para mostrar solo las del día seleccionado. */
    this.fechaSeleccionada = diaSinHora;
    this.cargarCartelera();

    /* Luego se cerrará el calendario. */
    this.mostrarFecha = false;
  }

  /* Este método devolverá true si el día pasado como parámetro es el día actual. */
  esHoy(dia: Date) {
    if (!dia) return false;
    const h = this.hoy;
    return (
      dia.getDate() === h.getDate() &&
      dia.getMonth() === h.getMonth() &&
      dia.getFullYear() === h.getFullYear()
    );
  }

  /* Este método devolverá true si el día pasado como parámetro es el mismo que la fecha seleccionada. */
  esSeleccionado(dia: Date) {
    if (!dia) return false;
    const f = this.fechaSeleccionada;
    return (
      dia.getDate() === f.getDate() &&
      dia.getMonth() === f.getMonth() &&
      dia.getFullYear() === f.getFullYear()
    );
  }

  /* Método para navegar al mes anterior, actualizando el calendario y la fecha seleccionada. */
  mesAnterior() {
    if (!this.puedeIrMesAnterior) return;

    this.mesActual--;
    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    }
    this.generarCalendario();
    this.fechaSeleccionada = new Date(this.anioActual, this.mesActual, 1);
    this.cargarCartelera();
  }

  /* Método para navegar al mes siguiente, actualizando el calendario. */
  mesSiguiente() {
    this.mesActual++;
    if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }
    this.generarCalendario();
    this.fechaSeleccionada = new Date(this.anioActual, this.mesActual, 1);
    this.cargarCartelera();
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

      /* Filtro por restricción de edad. */
      if (this.filtroEdad !== '' && p.restriccionEdad !== this.filtroEdad) {
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
    this.filtroEdad = '';
    this.filtroDuracion = '';
    this.filtroPuntuacion = '';

    this.peliculas = [...this.peliculasOriginales];
  }

  /* Método para navegar a la página de detalles de una película, usando el ID de la película de referencia. */
  irAPelicula(id: string) {
    this.router.navigate(['/pelicula', id]);
  }
}