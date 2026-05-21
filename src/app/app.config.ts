/* Imports necesarios. */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { loadingInterceptor } from './interceptores/loading.interceptor';

/* Exporta la configuración de la aplicación. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,

      /* El scroll será situado arriba del todo cada vez que se cambie de ruta. */
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      })

    ),

    /* Activa el HttpClient y se mostrará el loading cuando sea necesario.*/
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([loadingInterceptor])
    ),
  ]
};