/* Imports necesarios. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../servicios/loading.service';

/* Decorador del componente. */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})

/* Este componente se suscribe al estado del loading para determinar su vista.*/
export class LoadingComponent {

  cargando$;

  constructor(private loadingService: LoadingService) {
    this.cargando$ = this.loadingService.cargando$;
  }
}