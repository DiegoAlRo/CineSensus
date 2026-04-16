
/* Imports necesarias para el componente principal de la aplicación. */
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; 
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ToastComponent } from "./shared/toast/toast.component";

/* Especifica la configuración del componente principal de la aplicación. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/* Clase principal del componente de la aplicación. */
export class AppComponent implements OnInit {
  
  /* Mostrará el navbar dependiendo de la ruta actual. */
  mostrarNavbar = true;

  /* Se recibirán los cambios de la ruta y determinará si se muestra el navbar o no. */
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
    
        this.mostrarNavbar = event.url !== '/';
       
      }
    });
  }

  /* Vacío. */
  ngOnInit(): void {}
}
