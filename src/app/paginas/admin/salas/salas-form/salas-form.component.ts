/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalasService } from '../../../../servicios/salas.service';
import { ToastService } from '../../../../servicios/toast.service';

/* Decorador del componente. */
@Component({
  selector: 'app-salas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salas-form.component.html',
  styleUrls: ['./salas-form.component.css'],
})

/* Clase del componente de formulario de salas del admin. */
export class SalasFormComponent {

  /* propiedades del componente. */
  form!: FormGroup;
  modoEdicion = false;
  salaId!: string;

  /* Constructor del componente. */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salasService: SalasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    /* Se establecen las validaciones del formulario reactivo. */
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      filas: ['', [Validators.required, Validators.min(1)]],
      columnas: ['', [Validators.required, Validators.min(1)]],
    });

    /* Se obtiene el id de la sala de la ruta. */
    this.salaId = this.route.snapshot.params['id'];

    /* De haber id de una sala, se pasa al modo edición y se cargan los datos de la misma. */
    if (this.salaId) {
      this.modoEdicion = true;
      this.cargarSala();
    }
  }

  /* Este método cargará la sala. */
  cargarSala() {

    /* Se obtendrá la sala por el id. */
    this.salasService.getSala(this.salaId).subscribe({
      next: (sala) => {
        if (!sala.activo) {

          /* Se evitará editar una sala que no esté activa. */
          this.toastService.show(
            'Esta sala está eliminada y no puede editarse', 'error');
          this.router.navigate(['/admin/salas']);
          return;
        }

        /* Se rellenará el formulario con los datos a editar. */
        this.form.patchValue(sala);
      },
      error: () => this.toastService.show('Error al cargar la sala', 'error'),
    });
  }

  /* Este método servirá para guardar la sala. */
  guardar() {

    /* Se confirmará que el formulario es válido. */
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Completa todos los campos obligatorios', 'error');
      return;
    }

    /* Se obtendrán los datos del formulario. */
    const datos = this.form.value;

    /* De estar activo el modo edición, la sala se actualizará. */
    if (this.modoEdicion) {
      this.salasService.editarSala(this.salaId, datos).subscribe({
        next: () => {
          this.toastService.show('Sala actualizada correctamente', 'exito');
          this.router.navigate(['/admin/salas']);
        },
        error: () =>
          this.toastService.show('Error al actualizar la sala', 'error'),
      });
    } else {

      /* La sala se creará. */
      this.salasService.crearSala(datos).subscribe({
        next: () => {
          this.toastService.show('Sala creada correctamente', 'exito');
          this.router.navigate(['/admin/salas']);
        },
        error: () => this.toastService.show('Error al crear la sala', 'error'),
      });
    }
  }

  /* Este método cancelará el proceso y enviará al admin a la lista de salas. */
  cancelar() {
    this.router.navigate(['/admin/salas']);
  }
}
