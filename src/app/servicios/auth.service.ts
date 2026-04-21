/* Imports para el servicio de autenticación. */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../modelos/usuario';

/* El AuthService utiliza un BehaviorSubject para mantener el estado del usuario autenticado. */
@Injectable({
  providedIn: 'root',
})

/* Este servicio se encargará de gestionar el estado del usuario en la aplicación. */
export class AuthService {
  /* El usuarioSubject almacena la información del usuario autenticado. */
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);

  /* El usuario$ se podrá usar para obtener la información del usuario autenticado. */
  usuario$ = this.usuarioSubject.asObservable();

  /* Constructor del serviciio. */
  constructor() {
    
    /* Se busca en el localStorage si hay un usuario autenticado. */
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      try {
        this.usuarioSubject.next(JSON.parse(usuario));
      } catch {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
  }

  /* El método login almacena la información del usuario en el localStorage y actualiza el estado del usuario en el BehaviorSubject. */
  login(usuario: Usuario, token: string) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
    this.usuarioSubject.next(usuario);
  }

  /* Este método controlará si el usuario está logeado. */
  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  /* El método logout elimina la información del usuario del localStorage y actualiza el estado del usuario a null en el BehaviorSubject. */
  logout() {
    debugger
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
  }
}
