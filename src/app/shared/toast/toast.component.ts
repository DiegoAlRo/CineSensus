/* Imports necesarios para el componente. */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../servicios/toast.service';

/* Decorador del componente con su configuración. */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})

/* Clase del componente de toast. */
export class ToastComponent {

  /* El mensaje podrá ser de dos tipos. */
  mensaje: { mensaje: string; tipo: 'exito' | 'error' } | null = null;

  /* Se suscribe al observable del servicio para recibir y mostrar los mensajes del toast. */
  constructor(private toastService: ToastService) {
    this.toastService.mensaje$.subscribe((msg) => {
      this.mensaje = msg;
    });
  }
}