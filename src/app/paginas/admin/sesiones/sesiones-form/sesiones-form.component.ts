import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SesionesService } from '../../../../servicios/sesiones.service';
import { ReservasService } from '../../../../servicios/reservas.service';
import { PeliculasService } from '../../../../servicios/peliculas.service';
import { SalasService } from '../../../../servicios/salas.service';
import { ToastService } from '../../../../servicios/toast.service';

import { Pelicula } from '../../../../modelos/pelicula';
import { Sala } from '../../../../modelos/sala';

@Component({
  selector: 'app-sesiones-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sesiones-form.component.html',
  styleUrls: ['./sesiones-form.component.css'],
})
export class SesionesFormComponent {
  form!: FormGroup;
  modoEdicion = false;
  sesionId!: string;

  peliculas: Pelicula[] = [];
  salas: Sala[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sesionesService: SesionesService,
    private reservasService: ReservasService,
    private peliculasService: PeliculasService,
    private salasService: SalasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      pelicula: ['', Validators.required],
      sala: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      precio: [7.5, [Validators.required, Validators.min(0)]],
    });

    this.sesionId = this.route.snapshot.params['id'];

    this.cargarPeliculas();
    this.cargarSalas();

    if (this.sesionId) {
      this.modoEdicion = true;
      this.cargarSesion();
    }
  }

  cargarPeliculas() {
    this.peliculasService.getPeliculas().subscribe({
      next: (data) => {
        this.peliculas = data.filter((p) => p.activo);
      },
      error: () => this.toastService.show('Error al cargar películas', 'error'),
    });
  }

  cargarSalas() {
    this.salasService.getSalas().subscribe({
      next: (data) => {
        this.salas = data.filter((s) => s.activo);
      },
      error: () => this.toastService.show('Error al cargar salas', 'error'),
    });
  }

  cargarSesion() {
    this.sesionesService.getSesion(this.sesionId).subscribe({
      next: (sesion) => {
        if (!sesion.activo) {
          this.toastService.show(
            'Esta sesión está eliminada y no puede editarse',
            'error',
          );
          this.router.navigate(['/admin/sesiones']);
          return;
        }

        const fechaSesion = new Date(
          `${sesion.fecha}T${sesion.hora.slice(0, 2)}:${sesion.hora.slice(2, 4)}:00`,
        );

        if (fechaSesion < new Date()) {
          this.toastService.show('No puedes editar una sesión pasada', 'error');
          this.router.navigate(['/admin/sesiones']);
          return;
        }

        this.reservasService.getReservasPorSesion(this.sesionId).subscribe({
          next: (reservas) => {
            if (reservas.length > 0) {
              this.toastService.show(
                'No puedes editar una sesión que ya tiene reservas',
                'error',
              );
              this.router.navigate(['/admin/sesiones']);
              return;
            }

            this.form.patchValue({
              pelicula: sesion.pelicula.id,
              sala: sesion.sala.id,
              fecha: sesion.fecha.slice(0, 10),
              hora: sesion.hora.slice(0, 2) + ':' + sesion.hora.slice(2, 4),
              precio: sesion.precio,
            });
          },

          error: () => {
            this.toastService.show(
              'Error al comprobar reservas de la sesión',
              'error',
            );
            this.router.navigate(['/admin/sesiones']);
          },
        });
      },
      error: () => this.toastService.show('Error al cargar sesión', 'error'),
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Completa todos los campos obligatorios', 'error');
      return;
    }

    const datos = {
      ...this.form.value,
      hora: this.form.value.hora.replace(':', ''),
    };

    if (this.modoEdicion) {
      this.sesionesService.editarSesion(this.sesionId, datos).subscribe({
        next: () => {
          this.toastService.show('Sesión actualizada correctamente', 'exito');
          this.router.navigate(['/admin/sesiones']);
        },
        error: () =>
          this.toastService.show('Error al actualizar sesión', 'error'),
      });
    } else {
      this.sesionesService.crearSesion(datos).subscribe({
        next: () => {
          this.toastService.show('Sesión creada correctamente', 'exito');
          this.router.navigate(['/admin/sesiones']);
        },
        error: () => this.toastService.show('Error al crear sesión', 'error'),
      });
    }
  }

  cancelar() {
    this.router.navigate(['/admin/sesiones']);
  }
}
