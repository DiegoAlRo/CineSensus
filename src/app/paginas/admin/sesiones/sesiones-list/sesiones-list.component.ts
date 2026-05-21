/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SesionesService } from '../../../../servicios/sesiones.service';
import { Sesion } from '../../../../modelos/sesion';
import { ToastService } from '../../../../servicios/toast.service';
import { FormsModule } from '@angular/forms';

/* Decorador del componente. */
@Component({
  selector: 'app-sesiones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sesiones-list.component.html',
  styleUrls: ['./sesiones-list.component.css'],
})

/* Clase del componente de lista se sesiones del admin. */
export class SesionesListComponent implements OnInit {

  /* Propiedades del componente. */
  sesiones: Sesion[] = [];
  sesionesFiltradas: Sesion[] = [];
  salasUnicas: { id: string; nombre: string }[] = [];
  filtroTexto = '';
  filtroSala = '';
  filtroFecha = '';
  paginaActual = 1;
  elementosPorPagina = 10;

  /* Constructor del componente. */
  constructor(
    private sesionesService: SesionesService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    /* Las sesiones se cargarán desde un inicio. */
    this.cargarSesiones();
  }

  /* Este método cargará las sesiones en la tabla. */
  cargarSesiones() {

    /* Se obtendrán todas las sesiones. */
    this.sesionesService.getTodas().subscribe({
      next: (data) => {

        /* Se filtrarán las sesiones, apareciendo solo las activas. */
        this.sesiones = data
          .filter((s) => s.activo && s.pelicula && s.sala)
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime(),
          );
        this.sesionesFiltradas = this.sesiones;

        this.generarSalasUnicas();

        this.paginaActual = 1;
      },
      error: () => this.toastService.show('Error al cargar sesiones', 'error'),
    });
  }

  /* Se genrarán las salas únicas para el filtro de salas. */
  generarSalasUnicas() {
    const mapa = new Map<string, string>();

    for (const s of this.sesiones) {
      if (s.sala && s.pelicula) {
        mapa.set(s.sala.id, s.sala.nombre);
      }
    }

    this.salasUnicas = Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  }

  /* Este método aplicará los filtros de búsqueda. */
  aplicarFiltros() {

    /* Se obtendrá el texto especificado. */
    const texto = this.filtroTexto.toLowerCase();

    /* Se filtrarán las sesiones. */
    this.sesionesFiltradas = this.sesiones.filter((s) => {
      const coincideTexto =
        s.pelicula?.titulo?.toLowerCase().includes(texto) ||
        s.sala?.nombre?.toLowerCase().includes(texto) ||
        s.hora.includes(texto) ||
        s.fecha.includes(texto);

      const coincideSala = !this.filtroSala || s.sala.id === this.filtroSala;

      const coincideFecha =
        !this.filtroFecha || s.fecha.slice(0, 10) === this.filtroFecha;

      return coincideTexto && coincideSala && coincideFecha;
    });
    this.paginaActual = 1;
  }

  /* Se aplicará paginación a las sesiones filtradas. */
  get sesionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.sesionesFiltradas.slice(inicio, fin);
  }

  /* Se obtendrán todas las p´ginas. */
  get totalPaginas() {
    return Math.ceil(this.sesionesFiltradas.length / this.elementosPorPagina);
  }

  /* Estos métodos permitirán la navegación entre páginas. */
  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  /* Este método llevará al admin al formulario para crear una sesión. */
  crearSesion() {
    this.router.navigate(['/admin/sesiones/crear']);
  }

  /* Este método permitirá al admin editar una sesión. */
  editarSesion(id: string) {

    /* Se obtendrá la sesión a editar. */
    const sesion = this.sesiones.find((s) => s.id === id);

    /* De no haber sesión o estar eliminada, el admin no avanzará y se le informará. */
    if (!sesion) return;

    if (!sesion.activo) {
      this.toastService.show(
        'No es posible editar una sesión eliminada', 'error');
      return;
    }

    /* Se obtendrá la fecha de la sesión. */
    const fecha = new Date(
      `${sesion.fecha}T${sesion.hora.slice(0, 2)}:${sesion.hora.slice(2, 4)}:00`,
    );

    /* Se evitará la edición de una sesión pasada. */
    if (fecha < new Date()) {
      this.toastService.show('No es posible editar una sesión pasada', 'error');
      return;
    }

    this.router.navigate(['/admin/sesiones/editar', id]);
  }

  /* Este método servirá para eliminar la sesión. */
  eliminarSesion(id: string) {

    /* Se le pedirá confirmación antes al admin. */
    if (confirm('¿Seguro que quieres eliminar esta sesión?')) {
      this.sesionesService.eliminarSesion(id).subscribe({
        next: () => {
          this.toastService.show('Sesión eliminada correctamente', 'exito');
          this.cargarSesiones();
        },
        error: () =>
          this.toastService.show('Error al eliminar sesión', 'error'),
      });
    }
  }
}
