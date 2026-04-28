import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SalasService } from '../../../../servicios/salas.service';
import { ToastService } from '../../../../servicios/toast.service';

@Component({
  selector: 'app-salas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salas-form.component.html',
  styleUrls: ['./salas-form.component.css'],
})
export class SalasFormComponent {
  form!: FormGroup;
  modoEdicion = false;
  salaId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private salasService: SalasService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      filas: ['', [Validators.required, Validators.min(1)]],
      columnas: ['', [Validators.required, Validators.min(1)]],
    });

    this.salaId = this.route.snapshot.params['id'];

    if (this.salaId) {
      this.modoEdicion = true;
      this.cargarSala();
    }
  }

  cargarSala() {
    debugger
    this.salasService.getSala(this.salaId).subscribe({
      next: (sala) => this.form.patchValue(sala),
      error: () => this.toastService.show('Error al cargar la sala', 'error'),
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show('Completa todos los campos obligatorios', 'error');
      return;
    }

    const datos = this.form.value;

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
      this.salasService.crearSala(datos).subscribe({
        next: () => {
          this.toastService.show('Sala creada correctamente', 'exito');
          this.router.navigate(['/admin/salas']);
        },
        error: () => this.toastService.show('Error al crear la sala', 'error'),
      });
    }
  }

  cancelar() {
    this.router.navigate(['/admin/salas']);
  }
}
