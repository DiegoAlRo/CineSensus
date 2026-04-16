/* Imports para el componente de login. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { AuthService } from '../../servicios/auth.service';
import { ErroresService } from '../../servicios/errores.service';
import { ToastService } from '../../servicios/toast.service';

/* Decorador del componente de login. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

/* Clase del componente de login. */
export class LoginComponent {
  /* El login es un formulario reactivo. */
  form: FormGroup;

  /* Constructor para inyectar los servicios necesarios. */
  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private erroresService: ErroresService,
  ) {

    /* Método para manejar el proceso de inicio de sesión. */
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /* Método para verificar si un campo tiene un error específico. */
  tieneError(campo: string, error: string) {
    return (
      this.form.get(campo)?.hasError(error) && this.form.get(campo)?.touched
    );
  }

  /* Método para manejar el proceso de inicio de sesión. */
  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    /* Se obtiene el email y la contraseña del formulario. */
    const email = this.form.value.email.trim().toLowerCase();
    const password = this.form.value.password;

    /* Se llama al método login del servicio de usuarios para buscar coincidencias en la BDD. */
    this.usuariosService.login(email, password).subscribe({
      next: (usuario) => {
        this.authService.login(usuario);
        this.toastService.show('Bienvenido de nuevo');
        this.router.navigate(['/cartelera']);
      },

      /* Si ocurre un error, se muestra un mensaje. */
      error: (err) => {
        if (err.error?.mensaje === 'Credenciales incorrectas') {
          this.toastService.show(
            this.erroresService.get('credencialesIncorrectas'),
          );
        } else {
          this.toastService.show(this.erroresService.get('errorGenerico'));
        }
      },
    });
  }
}
