/* Imports necesarios. */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})

/* Esta es la clase del componente navbar del admin. */
export class AdminNavbarComponent implements OnInit {

  /* Administrador con sesión iniciada. */
  usuarioLogueado: any = null;

  /* Constructor del componente. */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    /* Se obtendrá el usuario logueado.*/
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });
  }

  /* Este método cerrará la sesión del admin y enviará el usuario al login. */
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}