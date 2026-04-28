import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SesionesService } from '../../../../servicios/sesiones.service';
import { Sesion } from '../../../../modelos/sesion';
import { ToastService } from '../../../../servicios/toast.service';

@Component({
  selector: 'app-sesiones-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sesiones-list.component.html',
  styleUrls: ['./sesiones-list.component.css']
})
export class SesionesListComponent implements OnInit {

  sesiones: Sesion[] = [];

  constructor(
    private sesionesService: SesionesService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarSesiones();
  }

  cargarSesiones() {
    this.sesionesService.getTodas().subscribe({
      next: (data) => this.sesiones = data,
      error: () => this.toastService.show('Error al cargar sesiones', 'error')
    });
  }

  crearSesion() {
    this.router.navigate(['/admin/sesiones/crear']);
  }

  editarSesion(id: string) {
    this.router.navigate(['/admin/sesiones/editar', id]);
  }

  eliminarSesion(id: string) {
    if (confirm('¿Seguro que quieres eliminar esta sesión?')) {
      this.sesionesService.eliminarSesion(id).subscribe({
        next: () => {
          this.toastService.show('Sesión eliminada correctamente', 'exito');
          this.cargarSesiones();
        },
        error: () => this.toastService.show('Error al eliminar sesión', 'error')
      });
    }
  }
}