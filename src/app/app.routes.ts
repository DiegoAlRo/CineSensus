/* Configuración de las rutas principales de la aplicación Angular. */
import { Routes } from '@angular/router';

/* Se definen las rutas de la aplicación, para lo que se usará Lazy loading. */
export const routes: Routes = [

  /* Esta ruta se cargará por defecto y mostrará la página de bienvenida. */
  { path: '', loadComponent: () => import('./paginas/bienvenida/bienvenida.component') .then(m => m.BienvenidaComponent) },
  { path: 'registro', loadComponent: () => import('./paginas/registro/registro.component') .then(m => m.RegistroComponent) },
  { path: 'login', loadComponent: () => import('./paginas/login/login.component') .then(m => m.LoginComponent) },
  { path: 'perfil', loadComponent: () => import('./paginas/perfil/perfil.component').then(m => m.PerfilComponent) },
  { path: 'cartelera', loadComponent: () => import('./paginas/cartelera/cartelera.component').then(m => m.CarteleraComponent) },
  { path: 'pelicula/:id', loadComponent: () => import('./paginas/info-pelicula/info-pelicula.component').then(m => m.InfoPeliculaComponent) },
  { path: 'sesion/:idSesion/asientos', loadComponent: () => import('./paginas/asientos/asientos.component').then(m => m.AsientosComponent) }

 ];
