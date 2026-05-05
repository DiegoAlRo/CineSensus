/* Imports del componente. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ToastService } from '../../servicios/toast.service';
import { ErroresService } from '../../servicios/errores.service';

/* Decorador del componente con su configuración. */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})

/* Clase del componente de registro. */
export class RegistroComponent {
  /* Declaración del formulario reactivo. */
  form: FormGroup;

  /* Este boolean y sus métodos, determinarán si se muestran o no los términos y condiciones. */
  abrirTerminos = false;


  mostrarTerminos() {
    this.abrirTerminos = true;
  }

  cerrarTerminos() {
    this.abrirTerminos = false;
  }

  /* Constructor del componente con la inyección de dependencias. */
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private toastService: ToastService,
    private erroresService: ErroresService,
  ) {
    /* Formulario con validaciones. */
    this.form = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
        apellidos: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.pattern(/.*\S.*/),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^\S+@\S+\.\S+$/),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmarPassword: ['', [Validators.required]],
        aceptaTerminos: [false, Validators.requiredTrue],
      },
      { validators: this.passwordsIguales('password', 'confirmarPassword') },
    );
  }

  /* Se comprueba que las contraseñas coincidan. */
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

  /* Método para verificar si un campo tiene un error específico. */
  tieneError(campo: string, error: string) {
    return (
      this.form.get(campo)?.hasError(error) && this.form.get(campo)?.touched
    );
  }

  /* Método para registrar un nuevo usuario. */
  registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    /* Se crea el objeto a rellenar de usuario. */
    const usuario = {
      nombre: this.form.value.nombre.trim(),
      apellidos: this.form.value.apellidos.trim(),
      username: this.form.value.username.trim(),
      email: this.form.value.email.trim().toLowerCase(),
      password: this.form.value.password,
    };

    /* Se llama al servicio para agregar el usuario a la base de datos. */
    this.usuariosService.addUsuario(usuario).subscribe({
      next: () => {
        /* Si el registro es exitoso, se muestra un mensaje y se redirige al login. */
        this.toastService.show('Se ha registrado correctamente', 'exito');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        /* Si ocurre un error, se muestra el mensaje correspondiente. */
        if (err.error?.mensaje === 'EMAIL_DUPLICADO') {
          this.toastService.show(this.erroresService.get('emailDuplicado'), 'error');
        } else if (err.error?.mensaje === 'USERNAME_DUPLICADO') {
          this.toastService.show(this.erroresService.get('usernameDuplicado'), 'error');
        } else {
          this.toastService.show(this.erroresService.get('errorGenerico'), 'error');
        }
      },
    });
  }
}
