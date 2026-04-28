import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ToastService } from '../../servicios/toast.service';

@Component({
  selector: 'app-cambiar-contrasena',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css'],
})
export class CambiarContrasenaComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.form = this.fb.group(
      {
        contrasenaActual: ['', Validators.required],
        nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
        confirmarContrasena: ['', Validators.required],
      },
      {
        validators: this.passwordsIguales(
          'nuevaContrasena',
          'confirmarContrasena',
        ),
      },
    );
  }

  passwordsIguales(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const p1 = formGroup.get(pass1);
      const p2 = formGroup.get(pass2);

      if (p1?.value !== p2?.value) {
        p2?.setErrors({ noCoincide: true });
      } else {
        if (p2?.hasError('noCoincide')) {
          p2.setErrors(null);
        }
      }
    };
  }

  tieneError(campo: string, error: string) {
    return (
      this.form.get(campo)?.hasError(error) && this.form.get(campo)?.touched
    );
  }

  cambiar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const datos = {
      contrasenaActual: this.form.value.contrasenaActual,
      nuevaContrasena: this.form.value.nuevaContrasena,
    };

    this.usuariosService.cambiarContrasena(datos).subscribe({
      next: () => {
        this.toastService.show('Contraseña actualizada correctamente', 'exito');
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        if (err.error?.mensaje === 'CONTRASENA_INCORRECTA') {
          this.toastService.show(
            'La contraseña actual no es correcta',
            'error',
          );
        } else {
          this.toastService.show('No se pudo cambiar la contraseña', 'error');
        }
      },
    });
  }
}
