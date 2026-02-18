import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Usuario } from '../../modelos/usuario';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  
  email: string = '';
  password: string = '';
  error: string = '';
  
  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private authService: AuthService
  ) {}
  
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