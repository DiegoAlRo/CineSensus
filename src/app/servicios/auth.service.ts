/* Servicio de autenticación para gestionar el estado del usuario en la aplicación. */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/* El AuthService utiliza un BehaviorSubject para mantener el estado del usuario autenticado. */
@Injectable({
  providedIn: 'root',
})

/* El servicio posee métodos para iniciar sesión, cerrar sesión y obtener el estado actual del usuario. */
export class AuthService {

  private usuarioSubject = new BehaviorSubject<any>(null);

  usuario$ = this.usuarioSubject.asObservable();

  constructor() {

    const data = localStorage.getItem('usuario');

    if (data) {
      this.usuarioSubject.next(JSON.parse(data));
    }

  }

  /* El método login almacena la información del usuario en el localStorage y actualiza el estado del usuario en el BehaviorSubject. */
  login(usuario: any) {

    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);

  }

  /* El método logout elimina la información del usuario del localStorage y actualiza el estado del usuario a null en el BehaviorSubject. */
  logout() {

    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    
  }
}
