/* Este componente ejercerá de barra superior en toda la página web. */
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

/* Se especifica la configuración del componente. */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})

/* Clase principal del componente de la barra de navegación. */
export class NavbarComponent implements OnInit {

  /* Se tendrá en cuenta si el usuario está logueado o no para mostrar su nombre y el botón de cerrar sesión. */
  usuarioLogueado: any = null;

  /* Se inyectan los servicios necesarios para la navegación y autenticación. */
  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {}

  /* Al iniciar el componente se suscribe al observable del usuario para actualizar la información del usuario logueado en la barra de navegación. */
  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });
  }

  /* Método para cerrar sesión. */
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  /* Método para volver a la página anterior. */
  volver() {
    this.location.back();
  }
}
