/* Se realizan los import necesarios para el servicio de películas. */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sesion } from '../modelos/sesion';

@Injectable({
  providedIn: 'root'
})

/* El servicio de peliculas se encarga de gestionar las sesiones/horarios. */
export class SesionesService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getSesiones(peliculaId: string, fecha: string): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(
      `${this.apiUrl}/sesiones?pelicula=${peliculaId}&fecha=${fecha}`
    );
  }
}