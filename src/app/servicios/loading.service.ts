/* Imports necesarios del servicio. */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/* Es accesible en toda la web. */
@Injectable({
  providedIn: 'root',
})

/* Este servicio se encargará de determinar cuando mostrar el loading. */
export class LoadingService {
  private cargandoSubject = new BehaviorSubject<boolean>(false);
  cargando$ = this.cargandoSubject.asObservable();

  /* Para mostrar el loading. */
  mostrar() {
    this.cargandoSubject.next(true);
  }

  /* para ocultar el loading. */
  ocultar() {
    this.cargandoSubject.next(false);
  }
}