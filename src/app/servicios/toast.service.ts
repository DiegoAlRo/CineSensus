/* Imports necesarios para el servicio. */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/* El servicio estará disponible en toda la aplicación. */
@Injectable({
  providedIn: 'root',
})

/* Este servicio se encargará de mostrar mensajes temporales al usuario. */
export class ToastService {

  /* Se utiliza un BehaviorSubject para manejar el mensaje actual del toast. */
  private mensajeSubject = new BehaviorSubject<{ mensaje: string; tipo: 'exito' | 'error' } | null>(null);
  mensaje$ = this.mensajeSubject.asObservable();

  /* Podrá haber dos tipos de mensaje, uno de éxito/informativo y otro de error. */
  show(mensaje: string, tipo: 'exito' | 'error' = 'exito') {
    this.mensajeSubject.next({ mensaje, tipo });

    /* El mensaje se mostrará por un tiempo limitado. */
    setTimeout(() => {
      this.mensajeSubject.next(null);
    }, 2500);
  }
}