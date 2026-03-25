/* Imports del componente. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';

/* Decorador del componente con su configuración. */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})

/* Clase del componente de registro. */
export class RegistroComponent {

  /* Declaración del formulario reactivo. */
  form: FormGroup;

  /* Constructor del componente con la inyección de dependencias. */
  constructor(

    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,

  ) {

    /* Formulario con validaciones. */
    this.form = this.fb.group( {

        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmarPassword: ['', Validators.required],

      },{ validators: this.passwordsIguales('password', 'confirmarPassword'), },
    );
  }

  /* Se comprueba que las contraseñas coincidan. */
  passwordsIguales(pass1: string, pass2: string) {

    return (formGroup: FormGroup) => {

      const p1 = formGroup.get(pass1);
      const p2 = formGroup.get(pass2);

      if (p1?.value !== p2?.value) { p2?.setErrors({ noCoincide: true }); } else {

        if (p2?.hasError('noCoincide')) { p2.setErrors(null); }

      }
    };
  }

  /* Método para registrar un nuevo usuario. */
  registrar() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    /* Se crea el objeto a rellenar de usuario. */
    const usuario = {
      nombre: this.form.value.nombre,
      apellidos: this.form.value.apellidos,
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
    };

    /* El usuario se añadirá a la BDD y se le enviará al login. */
    this.usuariosService.addUsuario(usuario).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
