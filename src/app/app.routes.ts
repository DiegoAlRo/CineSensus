/* Configuración de las rutas principales de la aplicación Angular. */
import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { noAuthGuard } from './shared/guards/no-auth.guard';

/* Se definen las rutas de la aplicación, para lo que se usará Lazy loading. */
export const routes: Routes = [

  /* Esta ruta se cargará por defecto y mostrará la página de bienvenida. */
  { path: '', loadComponent: () => import('./paginas/bienvenida/bienvenida.component') .then(m => m.BienvenidaComponent) },

  /* El resto de rutas serán accesibles siguiendo un flujo basado en carteleras reales. */
  { path: 'registro', loadComponent: () => import('./paginas/registro/registro.component') .then(m => m.RegistroComponent), canActivate: [noAuthGuard] },
  { path: 'login', loadComponent: () => import('./paginas/login/login.component') .then(m => m.LoginComponent), canActivate: [noAuthGuard] },
  { path: 'perfil', loadComponent: () => import('./paginas/perfil/perfil.component').then(m => m.PerfilComponent), canActivate: [authGuard] },
  { path: 'cartelera', loadComponent: () => import('./paginas/cartelera/cartelera.component').then(m => m.CarteleraComponent) },
  { path: 'pelicula/:id', loadComponent: () => import('./paginas/info-pelicula/info-pelicula.component').then(m => m.InfoPeliculaComponent) },
  { path: 'sesion/:idSesion/asientos', loadComponent: () => import('./paginas/asientos/asientos.component').then(m => m.AsientosComponent), canActivate: [authGuard] },
  { path: 'pago-entrada', loadComponent: () => import('./paginas/pago-entrada/pago-entrada.component').then(m => m.PagoEntradaComponent), canActivate: [authGuard] },
  { path: 'muestra-compra', loadComponent: () => import('./paginas/muestra-compra/muestra-compra.component').then(m => m.MuestraCompraComponent), canActivate: [authGuard] },

 ];
