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
    private mensajeSubject = new BehaviorSubject<string | null>(null);
    mensaje$ = this.mensajeSubject.asObservable();

    show(mensaje: string) {
        this.mensajeSubject.next(mensaje);

        setTimeout(() => {
        this.mensajeSubject.next(null);
        }, 2500);
    }
}
