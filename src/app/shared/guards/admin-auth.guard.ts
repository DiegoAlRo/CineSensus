/* Imports necesarios. */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/* Este guard solo le permitirá el acceso a aquellos usuarios con el rol de admin. */
export class adminAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    /* Se obtiene el usuario del localStorage. */
    const data = localStorage.getItem('usuario');

    /* De no haber usuario, se le enviará al login. */
    if (!data) {
      this.router.navigate(['/login']);
      return false;
    }

    /* Se convierte a JSON para comprobar su rol. */
    const usuario = JSON.parse(data);

    /* Se comprobará que el rol del usuario es admin para devolver true y poder continuar. */
    if (usuario.rol === 'admin') {
      return true;
    }

    /* Si el usuario no es un admin, se le enviará a la carteleta. */
    this.router.navigate(['/cartelera']);
    return false;
  }
}