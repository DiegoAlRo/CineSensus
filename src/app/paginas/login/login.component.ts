/* Imports para el componente de login. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Usuario } from '../../modelos/usuario';
import { AuthService } from '../../servicios/auth.service';

/* Decorador del componente de login. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/* Clase del componente de login. */
export class LoginComponent {
  
  /* Variables para el email, contraseña y mensaje de error. */
  email: string = '';
  password: string = '';
  error: string = '';
  
  /* Constructor para inyectar los servicios necesarios. */
  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private authService: AuthService
  ) {}
  
  /* Método para manejar el proceso de login. */
  login() {
    
    this.usuariosService.getUsuarios().subscribe(usuarios => {
      
      const usuario = usuarios.find(u => u.email === this.email && u.password === this.password );
      
      if (usuario) {
        
        this.authService.login(usuario);
        this.router.navigate(['/cartelera']);
      } else { 
        this.error = 'Correo o contraseña incorrectos'; 
      } 
    }); 
  }
}