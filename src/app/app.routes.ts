/* Configuración de las rutas principales de la aplicación Angular. */
import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { noAuthGuard } from './shared/guards/no-auth.guard';
import { adminAuthGuard } from './shared/guards/admin-auth.guard';

/* Se definen las rutas de la aplicación, para lo que se usará Lazy loading. */
export const routes: Routes = [

  /* Esta ruta se cargará por defecto y mostrará la página de bienvenida. */
  { path: '', loadComponent: () => import('./paginas/bienvenida/bienvenida.component') .then(m => m.BienvenidaComponent) },

  /* El resto de rutas serán accesibles siguiendo un flujo basado en carteleras reales. */
  { path: 'registro', loadComponent: () => import('./paginas/registro/registro.component') .then(m => m.RegistroComponent), canActivate: [noAuthGuard] },
  { path: 'login', loadComponent: () => import('./paginas/login/login.component') .then(m => m.LoginComponent), canActivate: [noAuthGuard] },
  { path: 'perfil', loadComponent: () => import('./paginas/perfil/perfil.component').then(m => m.PerfilComponent), canActivate: [authGuard] },
  { path: 'cambiar-contrasena', loadComponent: () => import('./paginas/cambiar-contrasena/cambiar-contrasena.component').then(m => m.CambiarContrasenaComponent), canActivate: [authGuard] },
  { path: 'cartelera', loadComponent: () => import('./paginas/cartelera/cartelera.component').then(m => m.CarteleraComponent) },
  { path: 'pelicula/:id', loadComponent: () => import('./paginas/info-pelicula/info-pelicula.component').then(m => m.InfoPeliculaComponent) },
  { path: 'sesion/:idSesion/asientos', loadComponent: () => import('./paginas/asientos/asientos.component').then(m => m.AsientosComponent) },
  { path: 'pago-entrada', loadComponent: () => import('./paginas/pago-entrada/pago-entrada.component').then(m => m.PagoEntradaComponent), canActivate: [authGuard] },
  { path: 'muestra-compra', loadComponent: () => import('./paginas/muestra-compra/muestra-compra.component').then(m => m.MuestraCompraComponent), canActivate: [authGuard] },
  { path: 'entrada/:id', loadComponent: () => import('./paginas/entrada/entrada.component').then(m => m.EntradaComponent), canActivate: [authGuard] },
  { path: 'admin', canActivate: [adminAuthGuard], loadComponent: () => import('./paginas/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: 'peliculas', loadComponent: () => import('./paginas/admin/peliculas/peliculas.component').then(m => m.PeliculasComponent) },
      { path: 'salas', loadComponent: () => import('./paginas/admin/salas/salas.component').then(m => m.SalasComponent) },
      { path: 'sesiones', loadComponent: () => import('./paginas/admin/sesiones/sesiones.component').then(m => m.SesionesComponent) },
      { path: 'reservas', loadComponent: () => import('./paginas/admin/reservas/reservas.component').then(m => m.ReservasComponent) },
      { path: 'usuarios', loadComponent: () => import('./paginas/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
      { path: 'resenas', loadComponent: () => import('./paginas/admin/resenas/resenas.component').then(m => m.ResenasComponent) },
      { path: '', redirectTo: 'peliculas', pathMatch: 'full' }
    ]
  }

];
