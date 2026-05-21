/* Imports necesarios. */
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../servicios/loading.service';

/* Esta es la clase del interceptor que dttectará cuando mostrar el loading. */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  /* Se mostrará el loading. */
  loadingService.mostrar();

  /* Se ocultará el loading. */
  return next(req).pipe(
    finalize(() => loadingService.ocultar())
  );
};