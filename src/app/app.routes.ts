import { Routes } from '@angular/router';

import { InicioComponent } from './paginas/inicio/inicio.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { LoginComponent } from './paginas/login/login.component';
import { CarteleraComponent } from './paginas/cartelera/cartelera.component';
import { PeliculaComponent } from './paginas/pelicula/pelicula.component';
import { AsientosComponent } from './paginas/asientos/asientos.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cartelera', component: CarteleraComponent },
  { path: 'pelicula/:id', component: PeliculaComponent },
  { path: 'asientos/:horarioId', component: AsientosComponent },
  {path: 'perfil', component: PerfilComponent },

  // Ruta comodín
  { path: '**', redirectTo: '' }
 ];
