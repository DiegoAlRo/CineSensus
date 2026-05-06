/* Este componente ejercerá de barra superior en toda la página web. */
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

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

  /* Este boolean determinará si el botón de volver será visible. */
  mostrarVolver = false;

  /* Este otro boolean determinará si el navbar completo será visible. */
  mostrarNavbar = true;

  /* Se inyectan los servicios necesarios para la navegación y autenticación. */
  constructor(
    private location: Location,
    private authService: AuthService,
    private router: Router,
  ) {}

  /* Al iniciar el componente se suscribe al observable del usuario para actualizar la información del usuario logueado en la barra de navegación. */
  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => {
      this.usuarioLogueado = usuario;
    });

    this.router.events.subscribe(() => {
      const ruta = this.router.url;

      /* El navbar se mostrará en todas las rutas excepto en la página de bienvenida. */
      this.mostrarNavbar = ruta !== '/';

      /* El botón de volver se mostrará en todas las rutas excepto en las siguientes: */
      this.mostrarVolver = !['/', '/registro', '/login', '/cartelera', '/perfil', '/muestra-compra'].includes(
        ruta,
      );
    });
  }

  /* Método para volver a la página anterior. */
  volver() {
    this.location.back();
  }
}
