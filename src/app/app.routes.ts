import { Routes } from '@angular/router';

import { RegistroComponent } from './paginas/registro/registro.component';
import { LoginComponent } from './paginas/login/login.component';
import { CarteleraComponent } from './paginas/cartelera/cartelera.component';
import { PeliculaComponent } from './paginas/pelicula/pelicula.component';
import { AsientosComponent } from './paginas/asientos/asientos.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';

export const routes: Routes = [
  { path: 'registro', component: RegistroComponent },
  { path: 'asientos/:horarioId', component: AsientosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'cartelera', loadComponent: () => import('./paginas/cartelera/cartelera.component').then(m => m.CarteleraComponent) },
  { path: 'pelicula/:id', loadComponent: () => import('./paginas/info-pelicula/info-pelicula.component').then(m => m.InfoPeliculaComponent) },
  { path: 'anadir', loadComponent: () => import('./paginas/anadir-pelicula/anadir-pelicula.component') .then(m => m.AnadirPeliculaComponent) },
  { path: '', loadComponent: () => import('./paginas/bienvenida/bienvenida.component') .then(m => m.BienvenidaComponent) },
  { path: 'editar/:id', loadComponent: () => import('./paginas/editar-pelicula/editar-pelicula.component') .then(m => m.EditarPeliculaComponent) },
  { path: 'registro', loadComponent: () => import('./paginas/registro/registro.component') .then(m => m.RegistroComponent) },
  { path: 'login', loadComponent: () => import('./paginas/login/login.component') .then(m => m.LoginComponent) }

 ];
