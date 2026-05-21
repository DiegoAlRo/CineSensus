/* Imports necesarios. */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

/* Este será el guard encargado de dar acceso al usuario logueado.*/
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  /* Se detectará si el usuario está logueado para enviar true. */
  if (auth.estaLogueado()) {
    return true;
  }

  /* De no estar logueado, se le llevará al login. */
  router.navigate(['/login']);
  return false;
};