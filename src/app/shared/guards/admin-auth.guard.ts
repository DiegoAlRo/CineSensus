import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class adminAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const data = localStorage.getItem('usuario');
    if (!data) {
      this.router.navigate(['/login']);
      return false;
    }

    const usuario = JSON.parse(data);

    if (usuario.rol === 'admin') {
      return true;
    }

    this.router.navigate(['/cartelera']);
    return false;
  }
}