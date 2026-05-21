/* imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SalasService } from '../../../../servicios/salas.service';
import { Sala } from '../../../../modelos/sala';
import { ToastService } from '../../../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-salas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salas-list.component.html',
  styleUrls: ['./salas-list.component.css'],
})

/* Clase del componente de listas de salas del admin. */
export class SalasListComponent {
  salas: Sala[] = [];

  /* Constructor del componente. */
  constructor(
    private salasService: SalasService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    /* las salas se cargarán desde un inicio. */
    this.cargarSalas();
  }

  /* Este método cargará las salas. */
  cargarSalas() {

    /* Se obtendrán todas las salas y se mostrarán las activas. */
    this.salasService.getSalas().subscribe({
      next: (data) => {
        this.salas = data.filter(s => s.activo);
      },
      error: () => this.toastService.show('Error al cargar salas', 'error'),
    });
  }

  /* Este método enviará al admin al formulario para crear una sala. */
  crearSala() {
    this.router.navigate(['/admin/salas/crear']);
  }

  /* Este método enviará al admin al formulario para editar una sala. */
  editarSala(id: string) {

    /* Se buscará la sala a editar. */
    const sala = this.salas.find((s) => s.id === id);
    if (sala && !sala.activo) {
      this.toastService.show('No puedes editar una sala eliminada', 'error');
      return;
    }

    /* Se enviará al admin al formulario para editar. */
    this.router.navigate(['/admin/salas/editar', id]);
  }

  /* Este método eliminará la sala. */
  eliminarSala(id: string) {

    /* Se le pedirá confirmación al admin. */
    if (confirm('¿Seguro que quieres eliminar esta sala?')) {
      this.salasService.eliminarSala(id).subscribe({
        next: () => {
          this.toastService.show('Sala eliminada correctamente', 'exito');
          this.cargarSalas();
        },
        error: () => this.toastService.show('Error al eliminar sala', 'error'),
      });
    }
  }
}
