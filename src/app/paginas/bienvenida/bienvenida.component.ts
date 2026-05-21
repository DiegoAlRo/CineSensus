/* Estos son los imports necesarios para el componente de bienvenida. */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/* El decorador del componente. */
@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})

/* Clase de la bienvenida vacía. */
export class BienvenidaComponent {}
