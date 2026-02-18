/* imports del componente. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  /* Constructor del componente con inyección de dependencias. */
  constructor(

    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,

  ) {

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],

    });
  }

  /* Método para registrar un nuevo usuario. */
  registrar() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.usuariosService.addUsuario(this.form.value).subscribe(() => {
      this.router.navigate(['/login']);
    });
    
  }
}
