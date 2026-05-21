/* Imports necesarios. */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SesionesService } from '../../../../servicios/sesiones.service';
import { ReservasService } from '../../../../servicios/reservas.service';
import { PeliculasService } from '../../../../servicios/peliculas.service';
import { SalasService } from '../../../../servicios/salas.service';
import { ToastService } from '../../../../servicios/toast.service';
import { Pelicula } from '../../../../modelos/pelicula';
import { Sala } from '../../../../modelos/sala';

/* Decorador del componente. */
@Component({
  selector: 'app-sesiones-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sesiones-form.component.html',
  styleUrls: ['./sesiones-form.component.css'],
})

/* Esta es la clase del componente de formulario de sesiones. */
export class SesionesFormComponent {

  /* Propiedades del componente. */
  form!: FormGroup;
  modoEdicion = false;
  sesionId!: string;
  peliculas: Pelicula[] = [];
  salas: Sala[] = [];

  /* Constructor del componente. */
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

    /* Se especificarán las validaciones de cada campo del formulario. */
    this.form = this.fb.group({
      pelicula: ['', Validators.required],
      sala: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      precio: [7.5, [Validators.required, Validators.min(0)]],
    });

    /* Se obtiene el id de la sesión. */
    this.sesionId = this.route.snapshot.params['id'];

    /* Se cargan las películas y salas para los select del formulario. */
    this.cargarPeliculas();
    this.cargarSalas();

    /* De haber una sesion, se pasa al modo edición. */
    if (this.sesionId) {
      this.modoEdicion = true;
      this.cargarSesion();
    }
  }

  /* Este método carga las películas activas para mostrarlas en el select del formulario. */
  cargarPeliculas() {
    this.peliculasService.getPeliculas().subscribe({
      next: (data) => {
        this.peliculas = data.filter((p) => p.activo);
      },
      error: () => this.toastService.show('Error al cargar películas', 'error'),
    });
  }

  /* Este método carga las salas activas para mostrarlas en el select del formulario. */
  cargarSalas() {
    this.salasService.getSalas().subscribe({
      next: (data) => {
        this.salas = data.filter((s) => s.activo);
      },
      error: () => this.toastService.show('Error al cargar salas', 'error'),
    });
  }

  /* Este método carga los datos de la sesión a editar y los muestra en el formulario. */
  cargarSesion() {
    this.sesionesService.getSesion(this.sesionId).subscribe({
      next: (sesion) => {
        if (!sesion.activo) {
          this.toastService.show('Esta sesión está eliminada y no puede editarse', 'error');
          this.router.navigate(['/admin/sesiones']);
          return;
        }

        /* Se comprueba que la sesión no sea pasada ni tenga reservas para permitir su edición. */
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
              this.toastService.show('No puedes editar una sesión que ya tiene reservas', 'error');
              this.router.navigate(['/admin/sesiones']);
              return;
            }

            /* Si la sesión es editable, se mostrarán sus datos en el formulario. */
            this.form.patchValue({
              pelicula: sesion.pelicula.id,
              sala: sesion.sala.id,
              fecha: sesion.fecha.slice(0, 10),
              hora: sesion.hora.slice(0, 2) + ':' + sesion.hora.slice(2, 4),
              precio: sesion.precio,
            });
          },

          error: () => {
            this.toastService.show('Error al comprobar reservas de la sesión', 'error');
            this.router.navigate(['/admin/sesiones']);
          },
        });
      },
      error: () => this.toastService.show('Error al cargar sesión', 'error'),
    });
  }

  /* Este método se encargará de guardar los datos del formulario. */
  guardar() {

    /* De no ser válido el formulario, se avisará al usuario. */
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Completa todos los campos obligatorios', 'error');
      return;
    }

    /* Se preparan los datos para enviarlos al backend. */
    const datos = {
      ...this.form.value,
      hora: this.form.value.hora.replace(':', ''),
    };

    /* De estar en modo edición, se actualizará la sesión, sino se creará una nueva. */
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
      /* Se crea una nueva sesión. */
      this.sesionesService.crearSesion(datos).subscribe({
        next: () => {
          this.toastService.show('Sesión creada correctamente', 'exito');
          this.router.navigate(['/admin/sesiones']);
        },
        error: () => this.toastService.show('Error al crear sesión', 'error'),
      });
    }
  }

  /* Este método se encargará de cancelar la operación y volver a la lista de sesiones. */
  cancelar() {
    this.router.navigate(['/admin/sesiones']);
  }
}
