import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SalasService } from '../../../../servicios/salas.service';
import { Sala } from '../../../../modelos/sala';
import { ToastService } from '../../../../servicios/toast.service';

@Component({
  selector: 'app-salas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salas-list.component.html',
  styleUrls: ['./salas-list.component.css']
})
export class SalasListComponent {

  salas: Sala[] = [];

  constructor(
    private salasService: SalasService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarSalas();
  }

  cargarSalas() {
    this.salasService.getSalas().subscribe({
      next: (data) => this.salas = data,
      error: () => this.toastService.show('Error al cargar salas', 'error')
    });
  }

  crearSala() {
    this.router.navigate(['/admin/salas/crear']);
  }

  editarSala(id: string) {
    this.router.navigate(['/admin/salas/editar', id]);
  }

  eliminarSala(id: string) {
    if (confirm('¿Seguro que quieres eliminar esta sala?')) {
      this.salasService.eliminarSala(id).subscribe({
        next: () => {
          this.toastService.show('Sala eliminada correctamente', 'exito');
          this.cargarSalas();
        },
        error: () => this.toastService.show('Error al eliminar sala', 'error')
      });
    }
  }
}