/* Estos son los imports necesarios para el componente de bienvenida. */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/* El decorador @Component define el componente de bienvenida, especificando su selector, los módulos que importa, la plantilla HTML y el archivo CSS asociado. */
@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})

export class BienvenidaComponent {

}
