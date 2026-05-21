/* Imports necesarios. */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

/* Este será el auth que le dará acceso al usuario no logueado. */
export const noAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  /* Se detectará si el usuario no está logueado para enviar true. */
  if (!auth.estaLogueado()) {
    return true;
  }

  /* Si se trata de un usuario logueado, se le enviará a la cartelera. */
  router.navigate(['/cartelera']);
  return false;
};